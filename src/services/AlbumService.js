import { request } from './security/AxiosSetup';

const ALBUMS_REST_API_URL = "http://localhost:8080/api/v1/albums";

/**
 * AlbumService handles all album-related API operations.
 * 
 * API Endpoints:
 * - GET /albums/{personId} - Get albums for a person
 * - GET /albums/{albumId} - Get single album
 * - GET /albums/{albumId}/media - Get album media
 * - POST /albums - Create new album
 * - POST /albums/{albumId}/upload - Get presigned upload URLs
 * - POST /albums/{albumId}/media - Create media records
 * - PATCH /albums/{albumId} - Update album (e.g., set cover photo)
 * - DELETE /albums/{albumId} - Delete album
 */
export class AlbumService {

    // Use shared request helper for consistency

    /**
     * Get all albums for a specific person/photographer
     * @param {string} personId - UUID of the person
     * @returns {Promise} Response with albums array
     */
    async getAlbumsByPerson(personId) {
        const response = await request('get', `${ALBUMS_REST_API_URL}/person/${personId}`);
        console.log(`Calling API URL: GET ${ALBUMS_REST_API_URL}/person/${personId} and receiving the following response:`, response);
        return response;
    }

    /**
     * Get single album by ID
     * @param {number} albumId - ID of the album
     * @returns {Promise} Response with album data
     */
    async getAlbum(albumId) {
        const response = await request('get', `${ALBUMS_REST_API_URL}/${albumId}`);
        console.log(`Calling API URL: GET ${ALBUMS_REST_API_URL}/${albumId} and receiving the following response:`, response);
        return response;
    }

    /**
     * Get all media files in an album
     * @param {number} albumId - ID of the album
     * @returns {Promise} Response with media array and download URLs
     */
    async getAlbumMedia(albumId) {
        const response = await request('get', `${ALBUMS_REST_API_URL}/${albumId}/media`);
        console.log(`Calling API URL: GET ${ALBUMS_REST_API_URL}/${albumId}/media and receiving the following response:`, response);
        return response;
    }

    /**
     * Create a new album
     * @param {Object} albumData - Album creation data
     * @param {string} albumData.title - Album title
     * @returns {Promise} Response with created album data
     */
    async createAlbum(albumData) {
        const response = await request('post', `${ALBUMS_REST_API_URL}`, albumData);
        console.log(`Calling API URL: POST ${ALBUMS_REST_API_URL} and receiving the following response:`, response);
        return response;
    }

    /**
     * Get presigned upload URLs for media files
     * @param {number} albumId - ID of the album
     * @param {Object} uploadRequest - Upload request data
     * @param {Array} uploadRequest.createMediaUploadLinks - Array of media upload link requests
     * @returns {Promise} Response with presigned upload URLs
     */
    async getUploadUrls(albumId, uploadRequest) {
        console.log(`getUploadUrls called with albumId: ${albumId}, type: ${typeof albumId}`);
        
        if (!albumId || albumId === 'undefined' || albumId === undefined) {
            throw new Error(`Invalid albumId for getUploadUrls: ${albumId}`);
        }
        
        const response = await request('post', `${ALBUMS_REST_API_URL}/${albumId}/upload`, uploadRequest);
        console.log(`Calling API URL: POST ${ALBUMS_REST_API_URL}/${albumId}/upload and receiving the following response:`, response);
        return response;
    }

    /**
     * Create media records in batch after S3 upload
     * @param {number} albumId - ID of the album
     * @param {Object} batchRequest - Batch media creation request
     * @param {Array} batchRequest.mediaList - Array of media creation requests
     * @returns {Promise} Response with created media IDs and results
     */
    async createAlbumMedia(albumId, requestBody) {
        console.log(`createAlbumMedia called with albumId: ${albumId}, type: ${typeof albumId}`);
        
        if (!albumId || albumId === 'undefined' || albumId === undefined) {
            throw new Error(`Invalid albumId for createAlbumMedia: ${albumId}`);
        }
        
        const response = await request('post', `${ALBUMS_REST_API_URL}/${albumId}/media`, requestBody);
        console.log(`Calling API URL: POST ${ALBUMS_REST_API_URL}/${albumId}/media and receiving the following response:`, response);
        return response;
    }

    /**
     * Update album (e.g., set cover photo)
     * @param {number} albumId - ID of the album
     * @param {Object} updateData - Update data
     * @param {string} [updateData.title] - New album title
     * @param {string} [updateData.coverMediaId] - UUID of cover media
     * @returns {Promise} Response with updated album data
     */
    async updateAlbum(albumId, updateData) {
        console.log(`updateAlbum called with albumId: ${albumId}, type: ${typeof albumId}`);
        
        if (!albumId || albumId === 'undefined' || albumId === undefined) {
            throw new Error(`Invalid albumId for updateAlbum: ${albumId}`);
        }
        
        const response = await request('patch', `${ALBUMS_REST_API_URL}/${albumId}`, updateData);
        console.log(`Calling API URL: PATCH ${ALBUMS_REST_API_URL}/${albumId} and receiving the following response:`, response);
        return response;
    }

    /**
     * Delete an album
     * @param {number} albumId - ID of the album
     * @returns {Promise} Response (204 No Content on success)
     */
    async deleteAlbum(albumId) {
        const response = await request('delete', `${ALBUMS_REST_API_URL}/${albumId}`);
        console.log(`Calling API URL: DELETE ${ALBUMS_REST_API_URL}/${albumId} and receiving the following response:`, response);
        return response;
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
     * COMPLEX UPLOAD FLOW: Multi-step process for uploading files to album
     *
     * This method orchestrates the complete file upload process:
     *
     * STEP 1: Generate Pre-signed URLs
     * - Creates UUID for each file
     * - Calls backend to get S3 presigned upload URLs
     * - Backend validates permissions and album ownership
     *
     * STEP 2: Upload Files to S3
     * - Uploads each file directly to S3 using presigned URLs
     * - Extracts ETag from successful S3 responses (proof of upload)
     * - Only files with ETags are considered successfully uploaded
     *
     * STEP 3: Create Media Records
     * - Only for files successfully uploaded to S3
     * - Calls backend batch API to create database records
     * - ETags stored locally for frontend caching only
     *
     * @param {number} albumId - ID of the target album
     * @param {Array} files - Array of File objects to upload
     * @param {Function} onProgress - Progress callback (fileIndex, status, error)
     *                               - fileIndex: current file index (-1 for global steps)
     *                               - status: 'getting-urls', 'uploading', 'uploaded', 'creating-records', 'completed', 'failed', 'error'
     *                               - error: error message (only for failed status)
     * @returns {Promise<Object>} Upload results object:
     *   - successful: [{file, mediaId, fileName, etag}] - Successfully uploaded files
     *   - failed: [{file, fileName, error}] - Failed uploads
     *   - totalFiles: number - Total files attempted
     *   - createdMediaIds: [UUID] - Database IDs of created records
     *   - batchErrors: [string] - Errors from database creation
     *   Note: ETags in successful array are used only for frontend caching
     */
    async uploadFiles(albumId, files, onProgress = () => {}, mediaIds = []) {
        console.log("uploadFiles called with albumId:", albumId, "type:", typeof albumId);

        this.validateInputs(albumId, files, mediaIds);

        try {
            const mediaUploadLinks = this.buildMediaUploadLinks(files, mediaIds);
            const uploadLinks = await this.getUploadLinks(albumId, mediaUploadLinks, onProgress);

            const results = this.initializeResults(files.length);
            await this.uploadFilesToS3(files, uploadLinks, results, onProgress);
            await this.createMediaRecords(albumId, results, onProgress);

            onProgress(-1, 'completed');
            return results;

        } catch (error) {
            console.error('Upload files error:', error);
            onProgress(-1, 'error', error.message);
            throw error;
        }
    }

    /**
     * Validate input parameters
     */
    validateInputs(albumId, files, mediaIds) {
        if (!albumId || albumId === 'undefined' || albumId === undefined) {
            throw new Error(`Invalid albumId: ${albumId}`);
        }

        if (!Array.isArray(mediaIds) || mediaIds.length !== files.length || mediaIds.some(id => !id)) {
            throw new Error('mediaIds must be provided for all files');
        }
    }

    /**
     * Build media upload links array from files and mediaIds
     */
    buildMediaUploadLinks(files, mediaIds) {
        return files.map((file, idx) => ({
            mediaId: mediaIds[idx],
            fileName: file.name
        }));
    }

    /**
     * Get upload links from backend
     */
    async getUploadLinks(albumId, mediaUploadLinks, onProgress) {
        onProgress(-1, 'getting-urls');
        const uploadUrlsResponse = await this.getUploadUrls(albumId, {
            createMediaUploadLinks: mediaUploadLinks
        });

        if (!uploadUrlsResponse.data || !uploadUrlsResponse.data.mediaMediaUploadLinks) {
            throw new Error('Failed to get upload URLs from server');
        }

        return uploadUrlsResponse.data.mediaMediaUploadLinks;
    }

    /**
     * Initialize results object
     */
    initializeResults(totalFiles) {
        return {
            successful: [],
            failed: [],
            totalFiles: totalFiles
        };
    }

    /**
     * Upload all files to S3
     */
    async uploadFilesToS3(files, uploadLinks, results, onProgress) {
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const uploadLink = uploadLinks[i];

            try {
                onProgress(i, 'uploading');

                const s3Response = await this.uploadFileToS3(uploadLink.uploadLink, file);

                if (s3Response.ok) {
                    const etag = s3Response.headers.get('ETag');
                    const successfulUpload = {
                        file,
                        mediaId: uploadLink.mediaId,
                        fileName: uploadLink.fileName
                    };

                    if (etag) {
                        successfulUpload.etag = etag.replace(/"/g, '');
                    }

                    results.successful.push(successfulUpload);
                    onProgress(i, 'uploaded');
                } else {
                    throw new Error(`S3 upload failed: ${s3Response.status}`);
                }
            } catch (error) {
                results.failed.push({
                    file,
                    fileName: file.name,
                    error: error.message
                });
                onProgress(i, 'failed', error.message);
            }
        }
    }

    /**
     * Create media records for successful uploads
     */
    async createMediaRecords(albumId, results, onProgress) {
        if (results.successful.length > 0) {
            onProgress(-1, 'creating-records');

            const requestBody = {
                mediaList: results.successful.map(item => ({
                    mediaId: item.mediaId,
                    fileName: item.fileName
                }))
            };

            const batchResponse = await this.createAlbumMedia(albumId, requestBody);

            if (batchResponse.data) {
                results.createdMediaIds = batchResponse.data.createdMediaIds;
                results.batchErrors = batchResponse.data.errors;
            } else {
                console.error('Batch media creation failed:', batchResponse);
            }
        }
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
}
