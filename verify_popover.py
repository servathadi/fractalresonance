from playwright.sync_api import sync_playwright, expect

def verify_popover():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        try:
            print("Navigating to http://localhost:3000")
            page.goto("http://localhost:3000")

            # Wait for some content
            page.wait_for_selector("h1")

            # Select text in the first paragraph or h1
            # We can use JS to select text
            print("Selecting text...")
            page.evaluate("""
                const range = document.createRange();
                const node = document.querySelector('h1');
                range.selectNodeContents(node);
                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);
                // Dispatch mouseup to trigger the popover
                document.dispatchEvent(new Event('mouseup'));
            """)

            # Wait for popover
            print("Waiting for popover...")
            popover = page.locator('div[role="toolbar"][aria-label="Text selection actions"]')
            popover.wait_for(state="visible", timeout=5000)

            # Check buttons
            print("Checking buttons...")
            copy_btn = popover.locator('button[aria-label="Copy selected text"]')
            twitter_btn = popover.locator('button[aria-label="Share selection on X (Twitter)"]')
            link_btn = popover.locator('button[aria-label="Copy page link with selection"]')

            expect(copy_btn).to_be_visible()
            expect(twitter_btn).to_be_visible()
            expect(link_btn).to_be_visible()

            print("Buttons found with correct aria-labels.")

            # Take screenshot
            page.screenshot(path="verification_popover.png")
            print("Screenshot saved to verification_popover.png")

        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification_error.png")
            raise e
        finally:
            browser.close()

if __name__ == "__main__":
    verify_popover()
