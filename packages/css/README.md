# @bubbly-design-system/css

Prebuilt CSS exports for the Bubbly Design System. Ship this package when you
just want raw tokens in CSS form without running Style Dictionary yourself.

## Usage

1. Build the design tokens once:

   ```bash
   pnpm --filter @bubbly-design-system/design-tokens build
   ```

2. Build the CSS package to copy the generated file into `dist/`:

   ```bash
   pnpm --filter @bubbly-design-system/css build
   ```

3. Import the bundled CSS from your consumer project:

   ```css
   @import "@bubbly-design-system/css";
   /* or target the explicit file */
   @import "@bubbly-design-system/css/tokens.css";
   ```

   or, with modern tooling:

   ```js
   import '@bubbly-design-system/css';
   ```

## Development

The build step simply copies the Style Dictionary output
(`packages/design-tokens/build/css/tokens.css`) into `dist/tokens.css`. If the
source file is missing you will see an instructive error asking you to build
the design tokens first.
