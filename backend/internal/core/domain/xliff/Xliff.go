package xliff

import "encoding/xml"

type Xliff struct {
	XMLName xml.Name `xml:"xliff"`
	FileXml FileXml  `xml:"file"`
	Version float32  `xml:"version,attr"`
	SrcLang string   `xml:"srcLang,attr"`
	TrgLang string   `xml:"trgLang,attr"`
}

type FileXml struct {
	XMLName xml.Name `xml:"file"`
	Units   []Unit   `xml:"unit"`
}

type Unit struct {
	XMLName xml.Name `xml:"unit"`
	Id      string   `xml:"id,attr"`
	Segment Segment  `xml:"segment"`
}

type Segment struct {
	XMLName xml.Name `xml:"segment"`
	Source  string   `xml:"source"`
	Target  string   `xml:"target"`
}
