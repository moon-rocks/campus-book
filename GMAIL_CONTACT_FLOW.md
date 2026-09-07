# Admin Gmail Contact Flow

This project intentionally does not use SMTP, Nodemailer, Gmail App Passwords, Gmail API, or automatic email sending.

Buyer requests are stored in `book_inquiries`. Seller Gmail/mobile are read from the related `books` row. In Admin > Book Requests, **Contact Seller** builds a `mailto:` URL with the seller email, subject, and buyer/book details prefilled. The admin's device/browser then opens the configured email application (Gmail if configured), and the admin presses Send.

Existing database statuses are reused:
- `pending` = Pending
- `approved` = Approved
- `active` = Contacted
- `closed` = Completed

No Gmail credentials are required.
