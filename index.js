import axios from "axios";
import express from "express";  
import { createDownloadLinks } from "./decryption.js"; // Ensure proper file path

const app = express();

app.get("/search", async (req, res) => {
    try {
        const queryParam = req.query.q;
        if (!queryParam) {
            return res.status(400).json({ error: "Missing query parameter 'q'" });
        }

        const response = await axios.get(`https://www.jiosaavn.com/api.php?__call=search.getResults&_format=json&_marker=0&api_version=4&ctx=web6dot0&q=${queryParam}&p=0&n=1`);
        
        const results = response.data?.results;
        if (!results || results.length === 0) {
            return res.status(404).json({ error: "No results found" });
        }

        const encryptedUrl = results[0].more_info?.encrypted_media_url;
        if (!encryptedUrl) {
            return res.status(404).json({ error: "No encrypted URL found" });
        }

        const decryptedUrls = createDownloadLinks(encryptedUrl);
        res.json(decryptedUrls);

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
