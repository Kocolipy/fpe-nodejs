'use strict';

const FPEncryption = require('./FPEncryption');
const crypto = require('crypto');
const BASE64 = require('./common-utils/Constants').BASE64;
const CommonUtils = require('./common-utils/CommonUtils');

/** Key Byte Array of the input text */
let keyByteArr = ''
/** Char map that gets updated upon RADIX selection */
let updatedCharMap;
/** Maximum Tweak length permitted */
let maxTlen = 32;
/** FF1 String is the final encrypted/decrypted output */
let ff1String;
/** Base 64 encoded 44 byte Key used to encrypt/decrypt  */
let key = '';
/** The secret key after Base 64 decoding */
let sec;
/** Numeric/alphanumeric Tweak string */
let TWEAK = '';
/** Common Utils instantiation */
let commonUtils = new CommonUtils();

class CryptoUtil {

    constructor(secretKey, tweak) {
        key = secretKey;
        keyByteArr = Buffer.from(key, BASE64);
        sec = crypto.createSecretKey(keyByteArr, BASE64);

        TWEAK = tweak;
        ff1String = new FPEncryption(secretKey, TWEAK, maxTlen);
    }

    /**
     * Function that is invoked by the consumer of this library to encrypt a text/number/alphanumeric value
     * @param {*} plainText the plain text input passed to be encrypted
     * @returns the cipher value after FPE FF1 mode of encryption
     */
    encrypt(plainText) {
        // sanitize the text input
        plainText = commonUtils.sanitizeTextInput(plainText);
        // sanitized text is used to find the radix
        let radix = commonUtils.getRadix(plainText);
        updatedCharMap = commonUtils.getUpdatedCharMap();

        return ff1String.encrypt(sec, TWEAK, plainText, radix, updatedCharMap);
    }

    /**
     * Function that is invoked by the consumer of this library to decrypt the cipher text that is encrypted using the same
     * logic & base64 encoded key
     * @param {*} cipherText the cipher text that is passed to be decrypted
     * @returns the decrypted plain text value after decryption
     */
    decrypt(cipherText) {
        // sanitize the cipher text
        cipherText = commonUtils.sanitizeTextInput(cipherText);
        // sanitized cipher text is used to find the radix
        let radix = commonUtils.getRadix(cipherText);
        updatedCharMap = commonUtils.getUpdatedCharMap();

        return ff1String.decrypt(keyByteArr, TWEAK, cipherText, radix, updatedCharMap);
    }
}

module.exports = CryptoUtil;