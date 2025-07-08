import { createHmac } from 'crypto';
function createHMAC(message, secret) {
    return createHmac('sha256', secret)
        .update(message)
        .digest("base64");
}
function replaceChars(input) {
    return input.replace(/[=+/]/g, charToBeReplaced => {
        switch (charToBeReplaced) {
            case '=':
                return '';
            case '+':
                return '-';
            case '/':
                return '_';
        }
    });
}
;
export function createJWT(user) {
    const header = JSON.stringify({
        "typ": "JWT",
        "alg": "HS256"
    });
    const payload = JSON.stringify({
        "sub": user.getID(),
        "name": user.getNick(),
        "role": user.getRole()
    });
    let b64header = Buffer.from(header).toString('base64');
    let b64payload = Buffer.from(payload).toString('base64');
    b64header = replaceChars(b64header);
    b64payload = replaceChars(b64payload);
    const secret = "secretstringasasassdfbvdbhtheherh";
    let hash = createHMAC(b64header + "." + b64payload, secret);
    hash = replaceChars(hash);
    return b64header + "." + b64payload + "." + hash;
}
