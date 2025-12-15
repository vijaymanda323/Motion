# Expo CLI Fix - Using Local Expo CLI

## Problem
You're seeing errors like:
- `Cannot find module 'expo/bin/cli.js'`
- `The legacy expo-cli does not support Node +17`

This happens because you're using the **deprecated global `expo-cli`** package.

## Solution
Use the **local Expo CLI** that comes with your `expo` package instead.

## Updated Commands

### ✅ Use `npx expo` instead of `expo`

**Before (deprecated):**
```bash
expo start
expo publish
expo build
```

**After (correct):**
```bash
npx expo start
npx expo publish
npx expo build
```

## Package.json Scripts

Your `package.json` scripts have been updated to use `npx expo`. You can now run:

```bash
npm start          # Uses npx expo start
npm run android    # Uses npx expo start --android
npm run ios        # Uses npx expo start --ios
```

## Uninstall Global Expo CLI (Optional)

If you want to remove the old global package:

```bash
npm uninstall -g expo-cli
```

## For Publishing Updates

If you need to publish updates, use:

```bash
npx expo publish
```

Or better yet, migrate to **EAS Update** (recommended for SDK 46+):
- Learn more: https://blog.expo.dev/sunsetting-expo-publish-and-classic-updates-6cb9cd295378

## Why This Happened

- **Old way**: Global `expo-cli` package installed via `npm install -g expo-cli`
- **New way**: Local Expo CLI bundled in your `expo` package (SDK 46+)
- The global package is deprecated and doesn't work well with newer Node.js versions

## Verify It Works

Run:
```bash
npx expo --version
```

This should show your Expo SDK version without errors.


