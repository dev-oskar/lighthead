// Line icons from the LightHead design system: 24px grid, 1.75 stroke, round caps.
export const PATHS = {
home: 'M4 11l8-7 8 7M6 9.5V20h12V9.5M10 20v-5h4v5',
session: 'M12 3c.8 2.6 4.8 4.8 4.8 9.6a4.8 4.8 0 0 1-9.6 0c0-2.4 1.3-3.9 2.3-4.8.3 1.5 1 2.4 2.2 2.9-.2-2.9-.6-5 .3-7.7z',
leaf: 'M5 19C5 10.5 10 5 19 5c0 9-5.5 14-14 14zM5 19l7.5-7.5',
break: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM10 9v6M14 9v6',
stash: 'M8 3h8M6.5 6h11M7 6v12.5A2.5 2.5 0 0 0 9.5 21h5a2.5 2.5 0 0 0 2.5-2.5V6M10 11.5h4',
stats: 'M5 20v-7M12 20V5M19 20v-11M3 20h18',
plus: 'M12 5v14M5 12h14',
minus: 'M5 12h14',
check: 'M5 12.5l4.5 4.5L19 7',
lock: 'M6 11h12v9.5H6zM8.5 11V8a3.5 3.5 0 0 1 7 0v3',
calendar: 'M4 6h16v14H4zM4 10.5h16M8.5 3v4M15.5 3v4',
cloud: 'M7 18.5a4 4 0 0 1-.6-7.95 6 6 0 0 1 11.5 1.45 3.25 3.25 0 0 1-.4 6.5z',
chevron: 'M9.5 6l6 6-6 6',
close: 'M6 6l12 12M18 6L6 18',
alert: 'M12 4l9 16H3zM12 10v4M12 17.2v.1',
clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7.5V12l3 2',
camera: 'M4 8h3.5L9 5.5h6L16.5 8H20v11H4zM12 16.5a3.25 3.25 0 1 0 0-6.5 3.25 3.25 0 0 0 0 6.5z'
} as const;

export type IconName = keyof typeof PATHS;
