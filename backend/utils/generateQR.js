const qrcode = require('qrcode');

const generateQR = async (data) => {
    try {
        const qrCodeDataUrl = await qrcode.toDataURL(typeof data === 'string' ? data : JSON.stringify(data));
        return qrCodeDataUrl;
    } catch (error) {
        console.error('Error generating QR code', error);
        throw error;
    }
};

module.exports = generateQR;
