from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()

    # Go to home page
    try:
        page.goto("http://localhost:3000")
        print("Navigated to home page")

        # Wait for hydration
        page.wait_for_timeout(5000)

        # Press Tab to focus the first interactive element
        page.keyboard.press("Tab")
        print("Pressed Tab")

        # The skip link should be focused and visible
        skip_link = page.locator("a[href='#main-content']")

        # Verify it is focused
        is_focused = skip_link.evaluate("el => el === document.activeElement")
        print(f"Skip link focused: {is_focused}")

        if is_focused:
            print("SUCCESS: Skip link receives initial focus")
        else:
            print("FAILURE: Skip link did not receive focus")
            focused_el = page.evaluate("document.activeElement.outerHTML")
            print(f"Actually focused: {focused_el}")

        # Take screenshot of the focused skip link
        page.screenshot(path="verification/skip_link_focused.png")
        print("Took screenshot of focused skip link")

        # Click the link (simulate Enter)
        page.keyboard.press("Enter")
        print("Pressed Enter")

        # Wait a bit for scroll/focus change
        page.wait_for_timeout(1000)

        # Verify focus moved to main content
        main_content = page.locator("#main-content")
        is_main_focused = main_content.evaluate("el => el === document.activeElement")
        print(f"Main content focused: {is_main_focused}")

        if is_main_focused:
             print("SUCCESS: Focus moved to main content")
        else:
             print("FAILURE: Focus did not move to main content")
             focused_el = page.evaluate("document.activeElement.outerHTML")
             print(f"Actually focused: {focused_el}")


    except Exception as e:
        print(f"Error: {e}")
        page.screenshot(path="verification/error.png")
    finally:
        browser.close()

with sync_playwright() as playwright:
    run(playwright)
