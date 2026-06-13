import { NextFunction, Request, Response } from "express";
import { pinata } from "../config/pinata.config.js";

const metadataController = {
  async uploadAgentMetadata(req: Request, res: Response, next: NextFunction) {
    try {
      const metadata = req.body;

      // Validate required fields for agent metadata
      if (!metadata) {
        res.status(400).json({ message: "Metadata is required" });
        return;
      }

      // Upload JSON to IPFS via Pinata
      const upload = await pinata.upload.public.json(metadata);

      res.status(200).json({
        ipfsHash: upload.cid,
        ipfsUrl: `ipfs://${upload.cid}`,
        metadata,
      });
    } catch (error) {
      console.error("[MetadataController] Error uploading to IPFS:", error);
      next(error);
    }
  },
};

export default metadataController;
