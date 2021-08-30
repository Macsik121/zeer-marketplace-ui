export default function template(body) {
    return `
        <!DOCTYPE html>
        <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Приватные читы  - купить на сайте мультихак 2021</title>
                <link rel="icon" href="/images/zeer-favicon.png" type="image/png">
                <link rel="stylesheet" href="/app.styles.css">
                <link rel="stylesheet" type="text/css" charset="UTF-8" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css" /> 
                <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css" />
            </head>
            <body>
                <div id="content">${body}</div>
                
                <script src="/vendor.bundle.js"></script>
                <script src="/app.bundle.js"></script>
            </body>
        </html>
    `
}