import puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';
import axios from 'axios';
import logger from './logger';

export interface FetchHtmlElementOptions {
    websiteUrl: string;
}

export default {
    fetchSponsoredHtmlElement: async (websiteUrl: string): Promise<string> => {
        let fullHtml: string | null = null;
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();

        try {
            await page.goto(websiteUrl, { waitUntil: 'domcontentloaded' });
            fullHtml = await page.content();
        } catch (error) {
            if (error instanceof Error) {
                logger.error(`Puppeteer failed: ${error.message}. Falling back to Axios.`);
            } else {
                logger.error(`Puppeteer failed: An unknown error occurred.`);
            }
            const response = await axios.get<string>(websiteUrl);
            const $ = cheerio.load(response.data);
            fullHtml = $.html();
        } finally {
            await browser.close();
        }

        if (!fullHtml) {
            throw new Error('Failed to fetch HTML content');
        }

        return fullHtml;
    },

    fetchSponsoredDomain: async (htmlContent: string): Promise<string[]> => {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        const sponsoredDomains: string[] = [];

        try {
            // Load the provided HTML content into Puppeteer
            await page.setContent(htmlContent, { waitUntil: 'domcontentloaded' });

            // Extract sponsored domain URLs
            const domains = await page.evaluate(() => {
                const elements = document.querySelectorAll('.x2VHCd.OSrXXb.ob9lvb'); // Update selector as needed
                return Array.from(elements)
                    .map((el) => {
                        if (el instanceof HTMLElement && el.getAttribute('data-dtld')) {
                            return `https://${el.getAttribute('data-dtld')}`;
                        }
                        return null;
                    })
                    .filter((url): url is string => !!url); // Filter out null values
            });

            sponsoredDomains.push(...domains);
        } catch (error) {
            if (error instanceof Error) {
                logger.error(`Error extracting sponsored domains: ${error.message}`);
            } else {
                logger.error(`Error extracting sponsored domains: Unknown error occurred.`);
            }
        } finally {
            await browser.close();
        }

        return sponsoredDomains;
    },
    pagesLink: async (htmlContent: string): Promise<string[]> => {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        const pagesLink: string[] = [];

        try {
            // Load the provided HTML content into Puppeteer
            await page.setContent(htmlContent, { waitUntil: 'domcontentloaded' });

            // Extract sponsored domain URLs
            const links = await page.evaluate(() => {
                // Select all anchor tags with the 'fl' class inside 'td.NKTSme'
                const elements = document.querySelectorAll('td.NKTSme a.fl');
                return Array.from(elements)
                    .map((el) => {
                        if (el instanceof HTMLAnchorElement && el.href) {
                            return el.href; // Get the full link
                        }
                        return null;
                    })
                    .filter((link): link is string => link !== null); // Filter out null values
            });

            pagesLink.push(...links);
            // links.forEach((link) => {
            //     pagesLink.push(`https://google.com${link}`); // Add the full link to the pagesLink array
            // });
        } catch (error) {
            if (error instanceof Error) {
                logger.error(`Error extracting sponsored domains: ${error.message}`);
            } else {
                logger.error(`Error extracting sponsored domains: Unknown error occurred.`);
            }
        } finally {
            await browser.close();
        }
        return pagesLink;
    }
};

