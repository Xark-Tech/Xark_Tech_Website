'use client';

import { useEffect, useState, useRef } from 'react';
import './style.scss';

interface BlogHtmlContentProps {
    htmlFileUrl: string;
}

const BlogHtmlContent = ({ htmlFileUrl }: BlogHtmlContentProps) => {
    const [htmlContent, setHtmlContent] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [iframeHeight, setIframeHeight] = useState('100vh');
    const iframeRef = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
        const fetchHtml = async () => {
            try {
                const response = await fetch(htmlFileUrl);
                if (!response.ok) {
                    throw new Error(`Failed to load HTML file: ${response.status}`);
                }
                let rawHtml = await response.text();
                
                // Inject a script to send the document height to the parent window
                const resizeScript = `
                    <script>
                        function sendHeight() {
                            const height = document.documentElement.scrollHeight || document.body.scrollHeight;
                            window.parent.postMessage({ type: 'iframe-resize', height: height }, '*');
                        }
                        window.onload = sendHeight;
                        window.onresize = sendHeight;
                        // Also observe DOM changes
                        if (window.MutationObserver) {
                            const observer = new MutationObserver(sendHeight);
                            observer.observe(document.body, { childList: true, subtree: true, attributes: true });
                        }
                    </script>
                `;
                
                // Insert the script right before </body>, or append if </body> is missing
                if (rawHtml.includes('</body>')) {
                    rawHtml = rawHtml.replace('</body>', resizeScript + '</body>');
                } else {
                    rawHtml += resizeScript;
                }
                
                // To keep styling intact securely within the iframe, we use srcDoc with the raw modified HTML.
                // Since this HTML is uploaded by authenticated CMS users, we trust its CSS,
                // but keep it isolated in the iframe so its styles don't leak to the Next.js app.
                setHtmlContent(rawHtml);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load content');
            } finally {
                setIsLoading(false);
            }
        };

        fetchHtml();
    }, [htmlFileUrl]);

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data && event.data.type === 'iframe-resize' && event.data.height) {
                setIframeHeight(`${event.data.height}px`);
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    if (isLoading) {
        return <div className="blog-html-content__loading">Loading…</div>;
    }

    if (error) {
        return <div className="blog-html-content__error">{error}</div>;
    }

    return (
        <div className="blog-html-content" style={{ width: '100%', overflow: 'hidden' }}>
            <iframe
                ref={iframeRef}
                srcDoc={htmlContent}
                title="Blog Content"
                style={{ width: '100%', height: iframeHeight, border: 'none', display: 'block' }}
                scrolling="no"
            />
        </div>
    );
};

export default BlogHtmlContent;
