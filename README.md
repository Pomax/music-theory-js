# Music Theory .JS

For when you want to do music things, using music theory, rather than just pressing keys that happen to "sounds good".

## What is?

While I was working on implementing the music theory side of things, I got side-tracked by the fact that I needed something to test that music theory with, so I implemented a draw bar synth organ. In the browser. There's a live demo up on https://pomax.github.io/music-theory-js/public/ but the controller mappings might be wrong because I'm testing this with an Arturia MiniLab and its uses a CC mapping that might not apply to your controller. Don't worry, though: CC-learning is supported, so just click on a label and then teach the synth which control code you want it to use.

There's also an arranger that currently supports both step tracking (each step its own note, with some velocity, duration, optional chord form, with optional chord inversion, and optional octave shift), as well as chord progression tracking (which is basically the same except you only define one note and subsequent steps just indicate which mode/tonic to use. Then magic happens.)

So... try this thing out, let's just make some music?

## How use?

Either hit up the above URL to just play around, or if you want to play with the _code_, fork and clone the repo, then `npm install` (or `yarn` if that's your thing), and then `npm test` to both start a continuous build and deploy on [http://localhost:8080](http://localhost:8080).

## How complain??

Opinions to [twitter](https://twitter.com/TheRealPomax) or [mastodon](https://mastodon.cloud/@TheRealPomax), please. Things that require we actually talk to each other should be filed as an [issue](issues) on this very github repo.

- Pomax
