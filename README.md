Retro Media Space is a themed, retro‑styled media player built with HTML, CSS, and JavaScript. The goal was to make each theme feel like its own personality while keeping the layout stable and letting the player functions work the same across all skins.

How I Built It:
The biggest challenge was getting the layout.css and the theme CSS files to stop fighting each other. At first, I over‑coded everything. My layout rules, theme rules, and component styles were all mixed together, and every change caused something else to break. I restarted layout.css and theme.css more than once because the layers kept clashing. 

Eventually, I slowed down and traced my steps one by one. I separated the project into three main parts that each have their own job:

1. HTML Structure  
 The HTML acts as the backbone of the entire site. Every section header, sidebar, main content, and the media player has a clear role. This makes it easier for the CSS themes to style things without changing how the page is built. The HTML stays consistent no matter which theme is active.

2. layout.css  
 This file controls the universal layout: spacing, positioning, flex/grid structure, and the general “shape” of the site. It does NOT control colors, borders, glow effects, or anything theme‑specific. Keeping layout.css clean and neutral was the key to stopping the conflicts.

3. Theme CSS Files (style-classic.css, style-tron.css, style-barbie.css)  
   Each theme file only handles visuals colors, backgrounds, borders, shadows, and the overall vibe. I made sure each theme acts independently unless something absolutely needed to be shared. This lets the Classic theme feel nostalgic, the Tron theme feel neon and futuristic, and the Barbie theme feel bright and playful. They all use the same HTML and layout, but they look completely different.

4. player.js  
   The JavaScript handles the actual media player logic: play, pause, stop, track info, time updates, volume, and the visualizer. Because the HTML structure is stable and the layout.css is consistent, player.js can interact with the elements the same way no matter which theme is active. The themes don’t affect functionality, only appearance.

How Everything Works Together:
The HTML provides the structure.  
layout.css provides the foundation.  
Each theme CSS file provides the personality.  
player.js brings the whole thing to life.

By keeping these layers separate, the site stays stable even as the themes change. It took a lot of restarting and fixing, but I learned how important it is to keep layout rules and theme rules in their own lanes.
