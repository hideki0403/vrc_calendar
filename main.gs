var presentationID = 'PREASE PASTE PRESENTATION ID IN HERE'
var file_id = 'PREASE PASTE FILE ID IN HERE'

// 以下のIDを書き換えてください（適当） 参考: https://tonari-it.com/gas-slides-objectid/
var obj = {
  date: 'i0',
  day: 'i1',
  anni: 'g8492f14c9a_0_0',
  month: 'g8492f14c9a_0_1',
  year: 'g8492f14c9a_0_2',
  week: 'g8492f14c9a_0_4'
}




var pres = SlidesApp.openById(presentationID)
var slides = pres.getSlides()
var slide = slides[0]

function manualUpdate() {
  main(true)
  Logger.log(new Date)
}

function main() {
  var today = new Date()
  today.setDate(today.getDate() + 1)

  var tmp_res_aniv = CalendarApp.getCalendarById('ja.japanese#holiday@group.v.calendar.google.com').getEventsForDay(today)
  
  if(tmp_res_aniv.length !== 0) {
    var result = tmp_res_aniv[0].getTitle()
  } else {
    var result = ' '
  }
  
  var days = ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日']
  var firstday = new Date(today.getFullYear(), 0, 1);
  var fulldays = Math.floor((today.getTime() - firstday.getTime()) / (1000 * 86400))
  
  var shapes = slide.getShapes()

  setValue('year', today.getFullYear() + '年')
  setValue('month', (today.getMonth() + 1) + '月')
  setValue('week', '第' + Math.floor((fulldays - today.getDay() + 12 ) / 7) + '週')
  setValue('date', today.getDate())
  setValue('day', days[today.getDay()])
  setValue('anni', result) 

  
  if(today.getDay() === 0 || result !== ' ') {
    setColor('#FF0000')
  } else if(today.getDay() === 6) {
    setColor('#4A86E8')
  } else {
    setColor('#000000')
  }
}

function setValue(key, val) {
  var shape = pres.getPageElementById(obj[key]).asShape()
  var str = shape.getText().asString()
  shape.getText().setText(val)
}

function setColor(color) {
  var target = ['anni', 'date', 'day']
  for(var i = 0; target.length > i; i++) {
   var shape = pres.getPageElementById(obj[target[i]]).asShape()
   var str = shape.getText().getTextStyle().setForegroundColor(color)
  }
}

function updatePicture() {
    var response = Slides.Presentations.Pages.getThumbnail(presentationID, slide.getObjectId())
    var blob = UrlFetchApp.fetch(response.contentUrl).getBlob()

    Drive.Files.update({title: 'vrc-calendar-v1',mimeType: 'image/png'},file_id, blob)
}

/* ---- SpreadSheet ----
A3: year
B3: month
C3: week
B4: date
B5: day
B6: anniv

[i0]: {date}
[i1]: {day}
[g8492f14c9a_0_0]: {anni}
[g8492f14c9a_0_1]: {month}
[g8492f14c9a_0_2]: {year}
[g8492f14c9a_0_4]: {week}
------------------------ */
