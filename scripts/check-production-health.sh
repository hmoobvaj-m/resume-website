#!/usr/bin/env bash
set -euo pipefail

HOSTS=(
    matthew.hmoobvaj.us
    portfolio.hmoobvaj.us
    professional.hmoobvaj.us
    contact.hmoobvaj.us
    resume.hmoobvaj.us
)

TEMP_DIR="$(mktemp -d)"
trap 'rm -rf -- "$TEMP_DIR"' EXIT

HEADERS="$TEMP_DIR/headers"
BODY="$TEMP_DIR/body"

fail() {
    printf 'FAIL: %s\n' "$*" >&2
    exit 1
}

check_response() {
    local url="$1"
    local expected_status="$2"
    local status

    status="$(curl \
        --proto '=https' \
        --silent \
        --show-error \
        --compressed \
        --connect-timeout 5 \
        --max-time 20 \
        --retry 1 \
        --retry-delay 2 \
        --dump-header "$HEADERS" \
        --output "$BODY" \
        --write-out '%{http_code}' \
        "$url")" || fail "Request failed: $url"

    [[ "$status" == "$expected_status" ]] ||
        fail "$url returned HTTP $status; expected $expected_status"

    printf 'PASS: %s returned HTTP %s\n' "$url" "$status"
}

check_header() {
    local pattern="$1"
    local description="$2"

    grep -Eiq "$pattern" "$HEADERS" ||
        fail "Missing or invalid $description"
}

check_html() {
    local url="$1"

    check_response "$url" 200

    check_header '^content-type:[[:blank:]]*text/html([;[:space:]]|$)' "HTML content type"
    check_header "^content-security-policy:[[:blank:]]*frame-ancestors 'none';[[:space:]]*$" "HTTP CSP"
    check_header '^strict-transport-security:[[:blank:]]*max-age=31536000([;[:space:]]|$)' "HSTS"
    check_header '^x-frame-options:[[:blank:]]*DENY[[:space:]]*$' "X-Frame-Options"
    check_header '^x-content-type-options:[[:blank:]]*nosniff[[:space:]]*$' "X-Content-Type-Options"

    if grep -Eiq '^content-security-policy-report-only:' "$HEADERS"; then
        fail "Unexpected legacy Report-Only CSP: $url"
    fi

    grep -Fq '<meta http-equiv="Content-Security-Policy"' "$BODY" ||
        fail "Embedded CSP missing: $url"

    printf 'PASS: HTML and security headers verified.\n'
}

check_pdf() {
    local url="$1"

    check_response "$url" 200

    check_header '^content-type:[[:blank:]]*application/pdf([;[:space:]]|$)' "PDF content type"

    [[ "$(head -c 5 "$BODY")" == "%PDF-" ]] ||
        fail "Invalid PDF signature: $url"

    printf 'PASS: PDF signature verified.\n'
}

check_contact() {
    local url="$1"

    check_response "$url" 405

    printf 'PASS: Contact endpoint rejects GET requests.\n'
}

for host in "${HOSTS[@]}"; do
    printf '\n=== %s ===\n' "$host"

    check_html "https://$host/"
    cp "$BODY" "$TEMP_DIR/homepage.html"

    check_html "https://$host/resume"

    if cmp -s "$BODY" "$TEMP_DIR/homepage.html"; then
        fail "Resume page returned the homepage: $host"
    fi

    check_pdf "https://$host/resume.pdf"
    check_contact "https://$host/api/contact"
done

printf '\nPASS: All production health checks completed.\n'