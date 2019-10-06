import attr


@attr.s
class Legislator:
    name = attr.ib()
    party = attr.ib()
