from heyoo import WhatsApp
messenger = WhatsApp('EAAPsqYfiEocBO6ZAlbWJ5DNDaFg4QocY8xsZBRlIzCYC8jmRxr6ui23vPADFnr9KoIUYOfBFBKmVHf8NEIfIiLnioGACTDmVwQOccmmpL0fZA7VD2wovaxH30B5PE3Lo9Ytyhz1BFVWZAnoneNHuDZCmf93b3Vvl30JFNQWZATuyJwDcyV4kegVAdoO6ZAfMz9CYRGUxxfFSZBFR8ZAGcsjOu8UWC2a3mRVNYXg4e', phone_number_id='108200075502022')

# For sending a Text messages
messenger.send_message('Hello I am WhatsApp Cloud API', '5537988347387')

# For sending an Image
messenger.send_image(
    image="https://i.imgur.com/YSJayCb.jpeg",
    recipient_id="5537988347387",
)
