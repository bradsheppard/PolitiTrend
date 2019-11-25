import attr


@attr.s
class Politician:
    name = attr.ib()
    party = attr.ib()
    img = attr.ib()
