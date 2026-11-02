import random

def circle_main(number, update_output):

    pocet = 0
    body = []

    for i in range(1, number + 1):

        a = random.uniform(0, 1) * 400
        b = random.uniform(0, 1) * 400

        kruh = ((a-200)**2 + (b-200)**2) < 200**2
        pocet += kruh

        body.append({
            "x": a,
            "y": b,
            "inside": kruh
        })

        text = (
            f"Pokus: {i}\n"
            f"Generujem bod: [{a}, {b}]\n"
            f"Lezi bod v kruhu? {kruh}\n"
            f"P(bod je v kruhu) = {pocet/i}"
        )

        update_output(text, body.copy())
        

def balls_main(number, good, bad, update_output):

    pocet = 0
    vytiahnutia = []

    for i in range(1, number + 1):

        a = random.randrange(0, good + bad)
        dobra = a < good
        pocet += dobra

        vytiahnutia.append({
            "x": a,
            "type": dobra
        })

        text = (
            f"Pokus: {i}\n"
            f"Vytiahnutie: gulička {a+1} ({'dobrá' if dobra else 'zlá'})\n"
            f"P(dobrá) = {pocet/i}"
        )

        update_output(text, vytiahnutia.copy())

def monty_main(number, update_output):
    pocet = 0
    vytiahnutia = []

    for i in range(1, number + 1):

        auto = random.randrange(0, 3)
        vyber = random.randrange(0, 3)
        if auto != vyber: otvorene = 3 - auto - vyber
        else: otvorene = random.choice([x for x in range(3) if x != auto])
        pocet += auto == vyber

        vytiahnutia.append({
            "type": auto == vyber,
        })

        text = (
            f"Pokus: {i}\n"
            f"Pôvodne vybrané: {vyber+1}\n"
            f"Auto je za dverami: {auto+1}\n"
            f"Odhalené dvere: {otvorene+1}\n"
            f"P(dobre sme zvolili na začiatku) = {pocet/i}\n"
            f"P(mali sme radšej zmeniť) = {1-pocet/i}"
        )

        update_output(text, vytiahnutia.copy())

def dice_main(number, sides, asked, update_output):
    pocet = 0
    
    rolls = []

    for i in range(1, number + 1):

        hod = random.randrange(1, sides+1)
        pocet += hod == asked
        
        rolls.append({
            "value": hod
        })

        text = (
            f"Pokus: {i}\n"
            f"Hod: {hod}\n"
            f"P(hodili sme {asked}) = {pocet/i}"
        )

        update_output(text, rolls.copy())
