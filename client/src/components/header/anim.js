export const opacity = {
  initial: { opacity: 0 },
  open:    { opacity: 1,  transition: { duration: 0.50, ease: [0.4, 0, 1, 1] } },
  closed:  { opacity: 0.2, transition: { duration: 0.35, ease: [0.4, 0, 1, 1] } },
};

export const height = {
  initial: { height: 0, opacity: 0 },
  enter:   { height: '100vh', opacity: 1, transition: { duration: 0.70, ease: [0.4, 0, 1, 1] } },
  exit:    { height: 0,       opacity: 0, transition: { duration: 0.50, ease: [0.4, 0, 1, 1] } },
};

export const blur = {
  open:   { filter: 'blur(4px)', opacity: 0.35, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
  closed: { filter: 'blur(0px)',  opacity: 1,    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
};

export const translate = {
  initial: { y: '100%', opacity: 0, rotateX: 45, transformPerspective: 400 },
  enter:   (d=[0,0]) => ({ y: 0,        opacity: 1, rotateX: 0,   transition:{ delay:d[0], duration: 0.80, ease:[0.4, 0, 1, 1] } }),
  exit:    (d=[0,0]) => ({ y: '-100%',  opacity: 0, rotateX: -30, transition:{ delay:d[1], duration: 0.50, ease:[0.4, 0, 1, 1] } }),
};

export const background = {
  initial: { scaleY: 0, transformOrigin: 'top' },
  open:    { scaleY: 1, transition: { duration: 0.70, ease:[0.4, 0, 1, 1] } },
  closed:  { scaleY: 0, transition: { duration: 0.50, ease:[0.4, 0, 1, 1] } }
};
