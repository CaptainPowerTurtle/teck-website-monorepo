echo "Installing project dependencies... "
bun install
echo "Building utillities package..."
bun turbo build --filter=@repo/utils
echo "Done! 🎉"