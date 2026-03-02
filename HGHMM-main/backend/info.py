from fastapi import FastAPI
from fastapi.responses import HTMLResponse

# Initialize FastAPI app
app = FastAPI()

@app.get("/info", response_class=HTMLResponse)
async def get_info():
    html_content = """
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Info</title>
    </head>
    <body>
        <h1>Info</h1>
        <h2>Hoe gaat het met mij?</h2>
        <p>Dit is een tool die nodigt je uit om even stil te staan bij jezelf. Leer jezelf kennen door een <strong>duik</strong> te nemen in je onbewuste.</p>

        <h2>De ijsberg</h2>
        <p>Je zult kennis maken met de ijsberg. Deze symboliseert <strong>bovenwater</strong> als je <strong>bewuste</strong> gedachten en gevoelens en <strong>onderwater</strong> als het <strong>onbewuste</strong>.</p>

        <h2>Vier rollen</h2>
        <p>Je verkent verschillende vragen die je door vier belangrijke rollen leiden. Ontdek jezelf als <strong>student</strong>, <strong>werknemer</strong>, <strong>vriend</strong> en <strong>familielid</strong>.</p>
    </body>
    </html>
    """
    return HTMLResponse(content=html_content)

# Run the app using `uvicorn` server
# uvicorn main:app --reload