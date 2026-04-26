#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { Feed } from 'feed';
import showdown from 'showdown';

function createFeeds() {
        const converter = new showdown.Converter({
                tables: true,
                metadata: true,
                ghCodeBlocks: true
        });
        converter.setFlavor('github');
        converter.setOption('simpleLineBreaks', false);

        [
                {
                        title       : "Cloud Outages",
                        description : "Recent major cloud outages. New additions to the 10+ years outage index.",
                        link        : "https://github.com/lwindolf/cloud-outages",
                        input       : path.join(import.meta.dirname, "../.."),
                        output      : "feed.atom"
                }
        ].forEach((f) => {
                // glob files in input directory in format <year>/<file>.md
                const files = fs.readdirSync(f.input, { withFileTypes: true, recursive: true })
                .filter(file => file.isFile() && file.name.endsWith('.md'))
                .map(file => path.join(file.path, file.name).replace(f.input + path.sep, ''))
                .filter(file => /^\d{4}\//.test(file));

                // Read posts from the posts directory
                const posts = files.map(file => {
                        const year = path.basename(path.dirname(file));
                        const content = fs.readFileSync(path.join(f.input, file), 'utf-8');
                        const frontMatterRegex = /^---[\s\S]*?---(?:\r?\n|\r)/m;
                        const cleanedContent = content.replace(frontMatterRegex, '').trim();
                        const m = file.match(/^(?<year>\d{4})\/(?<date>\d{4}-\d{2}-\d{2}) (?<title>.+).md$/);
                        const dateStr = m?.groups?.date;
                        return {
                                title   : dateStr + " " + (m?.groups?.title || ''),
                                date    : dateStr ? new Date(dateStr) : new Date(),
                                content : converter.makeHtml(cleanedContent),
                                link    : f.link + '/' + year + '/' + file,
                                id      : f.link + '/' + year + '/' + file
                        };
                })
                .sort((a, b) => b.date - a.date) // Sort by date descending
                .slice(0, 50); // Limit to the 50 most recent items

                // Create a new feed
                const feed = new Feed({
                        title       : f.title,
                        description : f.description,
                        id          : f.link,
                        link        : f.link
                });
                // Add posts to the feed
                posts.forEach(post => {
                feed.addItem({
                        title       : post.title,
                        id          : post.id,
                        link        : post.link,
                        description : post.content,
                        date        : post.date
                });
                });
                // Write the feed to a file
                fs.writeFileSync(f.output, feed.atom1(), 'utf-8');
                console.log(`Feed generated at ${f.output}`);
        });
}

// Run the build processes
createFeeds();
