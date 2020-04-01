import java.util.Calendar

object PathTranslator {
    def getS3Path(offset: Int = 0): String = {
        val now = Calendar.getInstance()
        now.add(Calendar.DAY_OF_YEAR, -offset)
        val currentYear = now.get(Calendar.YEAR)
        val currentMonth = "%02d".format(now.get(Calendar.MONTH) + 1)
        val currentDay = "%02d".format(now.get(Calendar.DAY_OF_MONTH))

        val s3Path = "s3a://tweets/topics/tweet-created/" +
            s"year=$currentYear/month=$currentMonth/day=$currentDay/*"

        s3Path
    }
}
