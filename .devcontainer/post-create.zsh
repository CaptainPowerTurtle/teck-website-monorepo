echo "Installing project dependencies... "
pnpm install
echo "Building utillities package..."
pnpm turbo build --filter=@repo/utils
echo "Done! 🎉"