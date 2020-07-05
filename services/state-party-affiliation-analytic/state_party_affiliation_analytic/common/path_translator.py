from datetime import datetime, timedelta


def get_s3_path(offset: int) -> str:
    now = datetime.now()
    now = now - timedelta(days=offset)

    s3_path = f's3://tweets/topics/tweet-created/' \
              f'year={now.year}/' \
              f'month={str(now.month).zfill(2)}/day=05/*/*'
    return s3_path
