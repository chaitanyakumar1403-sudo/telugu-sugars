import React from 'react';

/**
 * A heading whose words rise one after another out of their own baseline (see .wd in founder.css).
 * "Six things *I’m building.*" → the starred words are the tiger-orange accent.
 */
export function rise(text: string) {
  let on = false;
  return text.split(/\s+/).filter(Boolean).map((w, i) => {
    let o = on;
    if (w.startsWith('*')) { o = on = true; w = w.slice(1); }
    if (w.endsWith('*')) { w = w.slice(0, -1); on = false; }
    return (
      <React.Fragment key={i}>
        {i > 0 && ' '}
        <span className="wd" style={{ '--w': i } as React.CSSProperties}>
          {o ? <em>{w}</em> : <span>{w}</span>}
        </span>
      </React.Fragment>
    );
  });
}
