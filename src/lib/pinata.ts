export const uploadToPinata = async (data: any) => {
    const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;

    // Use JWT if available, otherwise fall back to API Key/Secret
    const headers: any = {
        'Content-Type': 'application/json',
    };

    if (process.env.PINATA_JWT) {
        headers['Authorization'] = `Bearer ${process.env.PINATA_JWT}`;
    } else {
        headers['pinata_api_key'] = process.env.PINATA_API_KEY;
        headers['pinata_secret_api_key'] = process.env.PINATA_SECRET_API_KEY;
    }

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`Pinata API Error: ${response.statusText}`);
        }

        const result = await response.json();
        return result.IpfsHash;
    } catch (error) {
        console.error("Error uploading to Pinata:", error);
        throw error;
    }
};
