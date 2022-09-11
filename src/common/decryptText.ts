

var crypto = require('crypto');


export async function decryptText(payload: any, key: string) {

    let ourIv = [0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x09, 0x0A, 0x0B, 0x0C, 0x0D, 0x0E, 0x0F, 0x00];
    const iv = Buffer.from(ourIv);
    var decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    decipher.setAutoPadding(false);
    var deciphered = Buffer.concat([decipher.update(payload, 'base64'), decipher.final()]);
    deciphered = decode(deciphered);
    return deciphered.toString();

}

export function decode(text: any) {
    var pad = text[text.length - 1];
    if (pad < 1 || pad > 16) {
        pad = 0;
    }

    return text.slice(0, text.length - pad);
}