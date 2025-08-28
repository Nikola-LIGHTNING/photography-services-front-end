import { request } from './security/AxiosSetup';

const MEDIA_REST_API_URL = "http://localhost:8080/api/v1/media";

export class MediaService {
    /**
     * Get single media by ID (includes presigned downloadLink)
     * @param {string} mediaId UUID
     */
    async getMedia(mediaId) {
        const response = await request('get', `${MEDIA_REST_API_URL}/${mediaId}`);
        console.log(`Calling API URL: GET ${MEDIA_REST_API_URL}/${mediaId} and receiving the following response:`, response);
        return response;
    }

    /**
     * Get presigned upload link for media file
     * @param {Object} uploadLinkData - Upload link request data
     * @param {string} uploadLinkData.mediaId UUID for the media file
     * @param {string} uploadLinkData.fileName Full file name with extension
     * @returns {Promise} Response with uploadLink
     */
    async getUploadLink(uploadLinkData) {
        const requestBody = {
            mediaId: uploadLinkData.mediaId,
            fileName: uploadLinkData.fileName
        };

        const response = await request('post', `${MEDIA_REST_API_URL}/upload`, requestBody);
        console.log(`Calling API URL: POST ${MEDIA_REST_API_URL}/upload with body:`, requestBody, 'and receiving the following response:', response);
        return response;
    }

    /**
     * Create new media (for profile pictures or standalone media)
     * @param {Object} mediaData - Media creation data
     * @param {string} mediaData.mediaId UUID for the media file
     * @param {string} mediaData.fileName Full file name with extension
     */
    async createMedia(mediaData) {
        const requestBody = {
            mediaId: mediaData.mediaId,
            fileName: mediaData.fileName
        };

        const response = await request('post', MEDIA_REST_API_URL, requestBody);
        console.log(`Calling API URL: POST ${MEDIA_REST_API_URL} with body:`, requestBody, 'and receiving the following response:', response);
        return response;
    }

    /**
     * Upload a single file (for profile pictures)
     * @param {File} file - The file to upload
     * @returns {Promise<Object>} Upload result with mediaId
     */
    async uploadFile(file) {
        try {
            // Step 1: Generate UUID and prepare upload data
            const mediaId = this.generateUUID();
            const uploadLinkData = {
                mediaId: mediaId,
                fileName: file.name
            };

            // Step 2: Get upload URL from backend
            const uploadResponse = await this.getUploadLink(uploadLinkData);

            if (!uploadResponse.data || !uploadResponse.data.uploadLink) {
                throw new Error('Failed to get upload URL from server');
            }

            const uploadUrl = uploadResponse.data.uploadLink;

            // Step 3: Upload file to S3
            const s3Response = await this.uploadFileToS3(uploadUrl, file);

            if (!s3Response.ok) {
                throw new Error(`S3 upload failed: ${s3Response.status}`);
            }

            // Step 4: Create media record in database
            const createMediaResponse = await this.createMedia(uploadLinkData);

            if (!createMediaResponse.data) {
                throw new Error('Failed to create media record');
            }

            return {
                success: true,
                mediaId: mediaId,
                fileName: file.name
            };

        } catch (error) {
            console.error('Error uploading file:', error);
            throw error;
        }
    }

    /**
     * Upload file directly to S3 using presigned URL
     * @param {string} presignedUrl - Presigned upload URL from backend
     * @param {File} file - File object to upload
     * @returns {Promise} Fetch response
     */
    async uploadFileToS3(presignedUrl, file) {
        return fetch(presignedUrl, {
            method: 'PUT',
            body: file,
            headers: {
                'Content-Type': file.type,
            }
        });
    }

    /**
     * Generate a UUID v4
     * @returns {string} UUID string
     */
    generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    /**
     * Delete single media by ID
     * @param {string} mediaId UUID
     */
    async deleteMedia(mediaId) {
        const response = await request('delete', `${MEDIA_REST_API_URL}/${mediaId}`);
        console.log(`Calling API URL: DELETE ${MEDIA_REST_API_URL}/${mediaId} and receiving the following response:`, response);
        return response;
    }
}


