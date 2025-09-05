import sharp from "sharp";
import heicConvert from "heic-convert"
import { fileTypeFromBuffer } from "file-type";

export type Normalized = {
    buffer: Buffer;
    contentType: "image/jpeg";
    ext: "jpg";
};

const ALLOWED = new Set([
    "image/jpeg", "image/pjpeg",
    "image/png",
    "image/webp",
    "image/avif",
    "image/heic", "image/heif", "image/heic-sequence",
]);

export async function normalizeAvatar(
    input: {
        buffer: Buffer
        filename?: string
        mimetype?: string
    },
    {
        target = "webp",         // 'webp' | 'jpeg' | 'png'
        size = 512,              // max width/height
        quality = 85,            // 1..100 for jpeg/webp
    } = {}
): Promise<Out> {
    const sniff = await fileTypeFromBuffer(input.buffer).catch(() => undefined);
    const mime = (sniff?.mime || input.mimetype || "").toLowerCase();
    const ext  = (sniff?.ext  || "").toLowerCase();

    const isHeic = ["image/heic", "image/heif", "image/heic-sequence"].includes(mime) || ["heic","heif"].includes(ext);
    let buf = input.buffer;

    if (isHeic) {
        buf = Buffer.from(await heicConvert({ buffer: buf, format: "JPEG", quality: 0.9 }));
        // Now treat like a JPEG
    }

    const img = sharp(buf).rotate().resize({ width: size, height: size, fit: "inside", withoutEnlargement: true });

    let out: Buffer;
    let outMime = target === "jpeg" ? "image/jpeg" : target === "png" ? "image/png" : "image/webp";
    if (target === "jpeg") out = await img.jpeg({ quality, mozjpeg: true }).toBuffer();
    else if (target === "png") out = await img.png().toBuffer();
    else out = await img.webp({ quality }).toBuffer();

    const outExt = target === "jpeg" ? "jpg" : target;
    return { buffer: out, ext: outExt, contentType: outMime };
}
