def get_s3_path(offset: int) -> str:
    s3_path = 's3a://tweets/topics/tweet-created/year=2020/month=04/day=30/hour=12/*'
    return s3_path
