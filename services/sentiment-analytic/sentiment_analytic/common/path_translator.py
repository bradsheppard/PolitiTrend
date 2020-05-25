from datetime import datetime, timedelta


def get_s3_path(offset: int) -> str:
    now = datetime.now()
    now = now - timedelta(days=offset)

    s3_path = f's3a://tweets/topics/tweet-created/' \
              f'year={now.year}/' \
              f'month={str(now.month).zfill(2)}/day={str(now.day).zfill(2)}/hour=01/*'
    return s3_path
