from fastapi import FastAPI
from fastapi.responses import HTMLResponse

# Initialize FastAPI app
app = FastAPI()

@app.get("/ondersteuning", response_class=HTMLResponse)
async def get_ondersteuning():
    html_content = """
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Ondersteuning</title>
    </head>
    <body>
        <h1>Ondersteuning</h1>
        <p>Hoe groot of klein je uitdaging ook is, er is altijd ondersteuning beschikbaar om je te helpen.</p>

        <h2>Binnen Zuyd</h2>
        <p>Zit je ergens mee en zou je hulp, een luisterend oor of begeleiding kunnen gebruiken?</p>
        <p>Via de link zie je <strong>wie of wat</strong> je zou kunnen helpen:</p>
        <p><a href="https://www.zuyd.nl/student">Ga naar zuyd.nl/student</a></p>

        <h2>Buiten Zuyd</h2>
        <p>Ook buiten school is er ondersteuning beschikbaar:</p>
        <ul>
            <li>Huisarts</li>
            <li>Praktijkondersteuner GGZ</li>
            <li>@EASE</li>
            <li>MIND Young</li>
            <li>Heytiseoke.nl</li>
            <li>Alles Oké? Supportlijn</li>
            <li>Jongerenhulponline.nl</li>
            <li>113 zelfmoordpreventie</li>
        </ul>
    </body>
    </html>
    """
    return HTMLResponse(content=html_content)

# Run the app using `uvicorn` server
# uvicorn main:app --reload
