var _acsii={' ':32,'!':33,'"':34,'#':35,'$':36,'%':37,'&':38,'\'':39,'(':40,')':41,'*':42,'+':43,',':44,'-':45,'.':46,'/':47,'0':48,'1':49,'2':50,'3':51,'4':52,'5':53,'6':54,'7':55,'8':56,'9':57,':':58,';':59,'<':60,'=':61,'>':62,'?':63,'@':64,'A':65,'B':66,'C':67,'D':68,'E':69,'F':70,'G':71,'H':72,'I':73,'J':74,'K':75,'L':76,'M':77,'N':78,'O':79,'P':80,'Q':81,'R':82,'S':83,'T':84,'U':85,'V':86,'W':87,'X':88,'Y':89,'Z':90,'[':91,'\\':92,']':93,'^':94,'_':95,'`':96,'a':97,'b':98,'c':99,'d':100,'e':101,'f':102,'g':103,'h':104,'i':105,'g':106,'k':107,'l':108,'m':109,'n':110,'o':111,'p':112,'q':113,'r':114,'s':115,'t':116,'u':117,'v':118,'w':119,'x':120,'y':121,'z':122,'{':123,'|':124,'}':125,'~':126};
function encrypt(key,m,t){var n=m2d(m);var a=new Array(),k=t.length;for(var i=0;i<k;i++){var hex=biToHex(biFromNumber(_acsii[t[i]]));var low=hex.substr(2);a.push(low);}var e=key,l=key.length;for(var i=n;i<l,a.length>0;i+=n){e=e.substr(0,i)+a.shift()+e.substr(i+2);}e+=biToHex(biFromNumber(k)).substr(2);return e;}
function m2d(m){var m=String(m);var n=0;for(var i=m.length-1,j=0;i>=0;i--,j++){n+=m[j]*Math.pow(2,i);}return n;}