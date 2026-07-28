# AI Second Brain — notes for maintainers

## Share URLs

- GitHub: https://github.com/EzAuto399/ai-second-brain
- Pages: https://ezauto399.github.io/ai-second-brain/
- Personal CTA: https://yodalai.xyz

## Regenerate social preview

```bash
# needs Chrome + node + puppeteer-core (or puppeteer)
npm i puppeteer-core --no-save
node render-social-preview.js
```

## Install path smoke checks

```bash
test -f SKILL.md && test -f README.md && test -f index.html && echo ok
```

## Attribution (do not remove)

Karpathy gist, Alex Freedman process, Greg Isenberg slash-command workflow, Charlie Hills original packaging (MIT).
