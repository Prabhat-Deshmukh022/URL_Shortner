import { customAlphabet } from "nanoid";


const base62 = customAlphabet("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", 6)

function generateShortUrl() {
    return base62() // Generates a 6-character short ID
}

export { generateShortUrl }