# Midnight Nexus Hub

Build a new app named NexOS inspired by the publicly visible UI structure of https://153.76.4.9.a-i.sh/ (Nocturne v2). Recreate the overall midnight-themed dashboard/navigation style, but do NOT copy proprietary source code, branding, text, assets, or backend behavior. NexOS must be an original implementation with its own branding and UI. Include fully working pages/features for: Home, Games, Apps, AI, Movies, Music, Code, Settings, and About. Explicitly exclude all proxy, web-unblocking, cloak, bypass, or network-filter circumvention functionality. Home: dashboard with quick links/cards and navigation. Games: a safe built-in game library with playable simple browser games and search/filter UI. Apps: app launcher/library with configurable cards and local favorites. AI: a local mock/demo AI chat interface that clearly states it is a demo unless an API is later connected; include chat history in local storage. Movies: a movie catalog UI with search, genres, details modal, and trailers represented as safe placeholder/demo actions rather than scraping copyrighted streams. Music: a music library/player UI supporting user-selected local audio files via browser file input, playlists, queue, play/pause/seek/volume, and localStorage metadata; do not provide copyrighted music downloads. Code: a browser code editor using Monaco or CodeMirror if practical, with HTML/CSS/JS tabs, syntax highlighting, run preview in a sandboxed iframe, save/load projects locally, and a reset button. Settings: appearance/background palette, ambient stars toggle, dynamic island toggle, performance level, search-engine preference as a harmless UI preference only (not a proxy), debug overlay, and reset settings. About: NexOS version, credits, technology information, privacy/legal placeholders. Make the visual style polished, responsive, dark/midnight, with subtle animations and a floating top navigation/dynamic island inspired by the reference but visually original. Persist user preferences and local content with localStorage. Add an owner-only editable admin/settings area: since project visibility can be private in Lovable, keep the project private and design an in-app owner/admin mode that is disabled by default and does not expose secrets in frontend code. The published site can be public for visitors, while editing remains restricted to the Lovable workspace owner. Do not implement authentication bypasses. Ensure accessibility, mobile responsiveness, and no external proxy functionality. First build the complete functional app, then verify all navigation and core interactions work.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://nexero-os.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/ef07c8fe-0e7b-4255-b997-adf3cee0e950).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
