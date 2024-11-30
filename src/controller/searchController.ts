import { NextFunction, Request, Response } from 'express';
import httpResponse from '../util/httpResponse';
import quicker from '../util/quicker';
import scrapers from '../util/scrapers';
import httpError from '../util/httpError';
import responseMessage from '../constant/responseMessage';
import { SponsoredData } from '../types/types';

interface SearchRequestBody {
    query: string;
}

export default {
    search: async (req: Request, res: Response, next: NextFunction) => {
        try {
            let sponsoredDomains: string[] = [];
            let pagesLink: string[] = [];
            let pagesLinkLength: number = 0;

            // Validate `req.body.query` and ensure it's a string
            const { query } = req.body as SearchRequestBody;
            if (!query) {
                throw new Error('Invalid or missing query parameter.');
            }

            const searchUrl: string = `https://www.google.com/search?q=${encodeURIComponent(query)}`;

            do {
                const currentUrl = pagesLinkLength === 0 ? searchUrl : pagesLink[pagesLinkLength - 1];

                // Fetch the HTML content of the page
                const htmlContent: string = await scrapers.fetchSponsoredHtmlElement(currentUrl);

                // Extract sponsored domains and remove duplicates
                const domains = await scrapers.fetchSponsoredDomain(htmlContent);
                sponsoredDomains = [...new Set([...sponsoredDomains, ...domains])];
                console.log('Sponsored Domains:', sponsoredDomains);

                // Fetch pagination links on specific conditions
                if (pagesLinkLength === 0 || pagesLinkLength === 9) {
                    const links = await scrapers.pagesLink(htmlContent);
                    const formattedLinks = links.map((link) => `https://www.google.com${link}`);
                    pagesLink = [...new Set([...pagesLink, ...formattedLinks])];
                }
                pagesLinkLength++;

                // Add random delay between requests
                const randomDelay: number = (Math.floor(Math.random() * 10) + 10) * 1000;
                await quicker.delay(randomDelay);
            } while (pagesLinkLength < pagesLink.length);
            console.info('......Finish.....');
            if (sponsoredDomains.length > 0) {
                const sponsoredData: SponsoredData = {
                    query,
                    sponsoredDomains,
                    pagesLinkLength: 15
                };
                httpResponse(req, res, 200, responseMessage.SPONSORED_DOMAIN, sponsoredData);
            } else {
                throw new Error('No sponsored domains found.');
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error('Error while extracting domains:', error.message);
                httpError(next, error, req, 500);
            } else {
                console.error('Unknown error occurred:', error);
                httpError(next, new Error('An unknown error occurred.'), req, 500);
            }
        }
    }
};

