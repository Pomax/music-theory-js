// proxy the Preact functions, so we only need to import from URL
// in the code once, rather than importing from URL in every file.
import { h, Component, render}
from 'https://cdn.jsdelivr.net/npm/preact/dist/preact.mjs';
export { h, Component, render };
