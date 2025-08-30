from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch()
    page = browser.new_page()

    # Listen for console events
    page.on("console", lambda msg: print(f"Browser console: {msg}"))

    # Verify Home page
    page.goto("http://localhost:5173")
    expect(page).to_have_title("Home | Gr8QM Technovates", timeout=10000)
    page.screenshot(path="jules-scratch/verification/home-verification.png")

    # Verify About page
    page.goto("http://localhost:5173/about")
    expect(page).to_have_title("About Us | Gr8QM Technovates", timeout=10000)
    page.screenshot(path="jules-scratch/verification/about-verification.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
