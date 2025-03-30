import axios from "axios";
import express from "express";  
import { createDownloadLinks } from "./decryption.js"; // Ensure proper file path

const app = express();
app.get('/',(req,res)=>{
    res.status(200).json("health is fine");
})

const fetchJioSaavnResults = async (queryParam) => {
    try {
        const response = await axios.get(
            `https://www.jiosaavn.com/api.php?__call=search.getResults&_format=json&_marker=0&api_version=4&ctx=web6dot0&q=${queryParam}&p=0&n=1`,
            {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.9',
                    'Connection': 'keep-alive',
                    'cache-control':'max-age=0'
                }
            }
        );
   
        
        return response;

    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

app.get("/search", async (req, res) => {
    try {
        const queryParam = req.query.q;
        if (!queryParam) {
            return res.status(400).json({ error: "Missing query parameter 'q'" });
        }

    //   const response= await fetchJioSaavnResults(queryParam);
        
    //     const results = response.data?.results;
    //     if (!results || results.length === 0) {
    //         return res.status(404).json({ error: "No results found" });
    //     }

    //     const encryptedUrl = results[0].more_info?.encrypted_media_url;
    //     if (!encryptedUrl) {
    //         return res.status(404).json({ error: "No encrypted URL found" });
    //     }

        const decryptedUrls = createDownloadLinks(queryParam);
        res.json(decryptedUrls);

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
