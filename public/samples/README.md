Samples from:

  https://www.orangetreesamples.com/blog/free-jazz-funk-drum-sample-library

Converted to mp3 using the following batch script:

  for %%a in (*.wav) do (
    ffmpeg.exe -i "%%a" -acodec libmp3lame "%%a".mp3
  )
