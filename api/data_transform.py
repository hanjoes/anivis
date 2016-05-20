#!/usr/bin/python2.7
# coding: utf-8

import json, xmltodict
from xml.etree import ElementTree as ET

'''
    info
    {
        "name"      : <_name>
        "genres"    : [<action, romance, adventure, shonen>]
        "themes"    : [<war, developing powers, fighting, pirates>]
    }

    anime_info
    {
        "movies" : [info_1, info_2, ...]
        "manga"  : [info_1, info_2, ...]
        "anime"  : [info_1, info_2, ...]
        ...
    }


'''


class Transform:
    UNKNOWN = "NA"

    TAG_ANN = "ann"
    TAG_ANIME = "anime"
    TAG_INFO = "info"
    TAG_RATING = "ratings"
    TAG_MANGA = "manga"

    TAG_ATTR_NAME = "name"
    TAG_ATTR_TYPE = "type"
    TAG_ATTR_SRC = "src"
    TAG_VALUE = "value"  # data contained with in the tag
    TAG_ATTR_TYPE_GENRES = "Genres"
    TAG_ATTR_TYPE_THEMES = "Themes"
    TAG_ATTR_TYPE_PICTURE = "Picture"
    TAG_ATTR_TYPE_SUMMARY = "Plot Summary"
    TAG_ATTR_WEIGHTED_SCORE = "weighted_score"

    MOVIES = "movies"
    MANGA = "manga"
    ANIME = "anime"
    ATTR_NAME = "name"

    ATTR_GENRE = TAG_ATTR_TYPE_GENRES
    ATTR_THEMES = TAG_ATTR_TYPE_THEMES
    ATTR_PICTURE = TAG_ATTR_TYPE_PICTURE
    ATTR_SUMMARY = TAG_ATTR_TYPE_SUMMARY

    info_tag_type_values = [TAG_ATTR_TYPE_GENRES, TAG_ATTR_TYPE_THEMES, TAG_ATTR_TYPE_SUMMARY]

    ROOT_PATH = "web/db"
    LIMIT = 1000
    NAME = "name"
    IS_ROOT = "isRoot"
    CHILDREN = "children"
    IS_LEAF = "isLeaf"
    TRUE = "yes"
    FALSE = "no"
    UNKNOWN_THEME = "No Theme"
    UNKNOWN_GENRE = "No Genre"
    ALL = "all"
    ALL_MANGA = "all_manga"
    ALL_ANIME = "all_anime"
    MANGA_TYPE = ["manga", "magazine"]

    SUMMARY = "summary"
    RATINGS = "ratings"
    IMAGE = "image"
    ANIME_DETAILS_PIC = "pic"
    ANIME_DETAILS_SIMILAR = "similar"
    ANIME_DETAILS_LINKS = "links"
    ANIME_DETIALS_RATING = "rating"

    all_anime_details = {}

    def __init__(self):
        pass

    # converts the given xml file to json string
    def xml_to_json(self, file_name):
        anime_infos = {}
        print file_name
        xml = ET.parse(file_name)
        root_element = xml.getroot()
        for children in root_element.findall(self.TAG_ANN):  # <ann>
            for anime in children:  # <anime> or <manga>
                if self.tag_attrib_value(anime, self.TAG_ATTR_NAME) != self.UNKNOWN:
                    anime_type, info = self.init_info(anime, anime_infos)
                    self.handle_tag(anime, info)
                    anime_infos[anime_type].append(info)
        return anime_infos

    # create a new anime info ()
    def init_info(self, anime, anime_infos):
        name = self.tag_attrib_value(anime, self.TAG_ATTR_NAME)
        info = self.default_info(name)
        anime_type = self.tag_attrib_value(anime, self.TAG_ATTR_TYPE)

        # create new type of for the info e.g manga, anime, movies OVA ...
        if anime_type not in anime_infos:
            anime_infos[anime_type] = []
        return anime_type, info

    # get given attrib value for the given tag
    def tag_attrib_value(self, tag_node, attib_name):
        if attib_name in tag_node.attrib:
            return tag_node.attrib[attib_name]
        return self.UNKNOWN

    # create handler method for each tag you want to process
    def handle_tag(self, tag_node, anime_info):
        self.handle_info_tags(tag_node, anime_info)
        self.handle_rating_tags(tag_node, anime_info)

    # handler for rating info
    def handle_rating_tags(self, tag_node, anime_info):
        anime_info[self.TAG_RATING] = "0"
        for rating in tag_node.findall(self.TAG_RATING):
            if self.TAG_ATTR_WEIGHTED_SCORE not in rating.attrib:
                continue
            rating_value = rating.attrib[self.TAG_ATTR_WEIGHTED_SCORE]
            if rating_value:
                anime_info[self.TAG_RATING] = rating_value

    # handler for different information that are to be in the <info> tag
    def handle_info_tags(self, root, anime_info):
        for info in root.findall(self.TAG_INFO):
            if self.TAG_ATTR_TYPE not in info.attrib:
                continue
            type_info = self.handle_info_tag_types(info)
            if type_info:
                if type_info[self.TAG_ATTR_TYPE] == self.TAG_ATTR_TYPE_SUMMARY:
                    anime_info[type_info[self.TAG_ATTR_TYPE]] = type_info[self.TAG_VALUE]
                else:
                    anime_info[type_info[self.TAG_ATTR_TYPE]].append(type_info[self.TAG_VALUE])

    # handles "type" attrib in the <info> tag which have value in "info_type"
    def handle_info_tag_types(self, tag_node):

        if tag_node.attrib[self.TAG_ATTR_TYPE] in self.info_tag_type_values:
            return {self.TAG_ATTR_TYPE: tag_node.attrib[self.TAG_ATTR_TYPE], self.TAG_VALUE: tag_node.text}
        elif tag_node.attrib[self.TAG_ATTR_TYPE] == self.TAG_ATTR_TYPE_PICTURE:
            return {self.TAG_ATTR_TYPE: tag_node.attrib[self.TAG_ATTR_TYPE],
                    self.TAG_VALUE: tag_node.attrib[self.TAG_ATTR_SRC]}

    def default_info(self, name):
        return {self.ATTR_NAME: name, self.ATTR_GENRE: [], self.ATTR_THEMES: [], self.ATTR_PICTURE: [],
                self.ATTR_SUMMARY: ""}

    def parse_all_files(self, xml_dir, des_folder, is_per_file):
        import os
        all_data = []
        for fn in os.listdir(xml_dir):
            src_file = xml_dir + "/" + fn
            if os.path.isfile(src_file):
                data = self.xml_to_json(src_file)
                if (is_per_file):
                    file_name = str(fn.split(".")[0]) + ".json"
                    des_file = des_folder + "/" + file_name
                    with open(des_file, "w+") as jsonfile:
                        jsonfile.write(json.dumps(data))
                else:
                    all_data.append(data)

        if not is_per_file:
            result = {}

            for data in all_data:
                for key, value in data.iteritems():
                    if key not in result:
                        result[key] = value
                    else:
                        result[key] = result[key] + value

            self.intermediate_transform_v2(result)

            file_name = "anime.json"
            des_file = des_folder + "/" + file_name
            with open(des_file, "w+") as jsonfile:
                jsonfile.write(json.dumps(result))

    """

    {
     "name": "Animes",
     "isRoot": "yes",
     "children": [
          {
            "name": "TV",
            "children": [
              {
                "name": "Themes",
                "children": [
                  {
                    "name": "fighting",
                    "children": [
                      {
                        "name": "Mobile Fighter G Gundam",
                        "leaf": "yes"
                      },
                      { "name": "Movie 2", "leaf": "yes", "animeId": 32 },
                      { "name": "Movie 3", "leaf": "yes", "animeId": 2 },
                      { "name": "Movie 2", "leaf": "yes", "animeId": 32 }
                    ]
                  },
                  {
                    "name": "martial arts",
                    "children": [
                      { "name": "martial arts 1", "leaf": "yes", "animeId": 90},
                      { "name": "martial arts 2", "leaf": "yes", "animeId": 1},
                      { "name": "martial arts 3", "leaf": "yes", "animeId": 23}
                    ]
                  }
                ]
              }
            ]
          },
          {
            "name": "Magazine",
            "children": [
              {
                "name": "Themes",
                "children": [
                  {
                    "name": "fighting",
                    "children": [
                      {
                        "name": "Mobile Fighter G Gundam",
                        "leaf": "yes"
                      },
                      { "name": "Movie 2", "leaf": "yes", "animeId": 32 },
                      { "name": "Movie 3", "leaf": "yes", "animeId": 2 },
                      { "name": "Movie 2", "leaf": "yes", "animeId": 32 }
                    ]
                  },
                  {
                    "name": "martial arts",
                    "children": [
                      { "name": "martial arts 1", "leaf": "yes", "animeId": 90},
                      { "name": "martial arts 2", "leaf": "yes", "animeId": 1},
                      { "name": "martial arts 3", "leaf": "yes", "animeId": 23}
                    ]
                  }
                ]
              }
            ]
          }
         ]
    }

    """

    def gen_anime_details_node(self, summary, image, links, rating, similar):
        return {self.SUMMARY: summary, self.ANIME_DETAILS_PIC: image, self.ANIME_DETIALS_RATING: rating,
                self.ANIME_DETAILS_SIMILAR: similar}

    def gen_default_node(self, name, _type, _children):
        if type(_children) is not list:
            _children = [_children]
        return {self.NAME: name, _type: "yes", self.CHILDREN: _children}

    def gen_zoom_node(self, summary, image, rating):
        return {self.SUMMARY: summary, self.IMAGE: image, self.TAG_RATING: rating}

    def gen_leaf_anime_node(self, name, _type):
        return {self.NAME: name, _type: "yes"}

    def gen_leaf_rating_node(self, name, rating):
        return {self.TAG_RATING: rating, self.ANIME: {self.NAME: name}}

    def gen_default_leaf(self, name):
        return {self.NAME: name, self.IS_ROOT: self.FALSE, self.IS_LEAF: self.TRUE}

    # def intermediate_transform(self, json_data):
    #     inter_data = {}
    #     for data in json_data:
    #         type = data  # TV, OVA, MOVIE , MANGA ,MAGAZINE...
    #         if type not in inter_data:
    #             inter_data[type] = {}
    #         for anime in json_data[data]:
    #             anime_name = anime[self.ATTR_NAME]
    #
    #             # process all different themes
    #             if self.ATTR_THEMES not in inter_data[type]:
    #                 inter_data[type][self.ATTR_THEMES] = {}
    #             if len(anime[self.ATTR_THEMES]) == 0:
    #                 if self.UNKNOWN_THEME not in inter_data[type][self.ATTR_THEMES]:
    #                     inter_data[type][self.ATTR_THEMES][self.UNKNOWN_THEME] = {}
    #                 inter_data[type][self.ATTR_THEMES][self.UNKNOWN_THEME][anime_name] = self.gen_default_leaf(
    #                     anime_name)
    #
    #             else:
    #                 for theme in anime[self.ATTR_THEMES]:
    #                     theme = theme.replace("/", "")
    #                     if theme not in inter_data[type][self.ATTR_THEMES]:
    #                         inter_data[type][self.ATTR_THEMES][theme] = {}
    #                     inter_data[type][self.ATTR_THEMES][theme][anime_name] = self.gen_default_leaf(anime_name)
    #
    #             # process all different genre
    #             if self.ATTR_GENRE not in inter_data[type]:
    #                 inter_data[type][self.ATTR_GENRE] = {}
    #
    #             if len(anime[self.ATTR_GENRE]) == 0:
    #                 if self.UNKNOWN_GENRE not in inter_data[type][self.ATTR_GENRE]:
    #                     inter_data[type][self.ATTR_GENRE][self.UNKNOWN_GENRE] = {}
    #                 inter_data[type][self.ATTR_GENRE][self.UNKNOWN_GENRE][anime_name] = self.gen_default_leaf(
    #                     anime_name)
    #             else:
    #                 for genre in anime[self.ATTR_GENRE]:
    #                     genre = genre.replace("/", "")
    #                     if genre not in inter_data[type][self.ATTR_GENRE]:
    #                         inter_data[type][self.ATTR_GENRE][genre] = {}
    #                     inter_data[type][self.ATTR_GENRE][genre][anime_name] = self.gen_default_leaf(anime_name)
    #     self.gen_zoomed_in_view_data(inter_data)
    #
    # def gen_zoomed_in_view_data(self, intermediate_data):
    #     import re
    #     root = "web"
    #     manga_type = ["manga", "magazine"]
    #     for type in intermediate_data:
    #         path = "db/anime/"
    #         if type in manga_type:
    #             path = "db/manga/"
    #         path += str(re.escape(type))
    #         for categories in intermediate_data[type]:
    #             dir_path = path + "/" + str(re.escape(categories))
    #             self.create_dir(dir_path)
    #             for data in intermediate_data[type][categories]:
    #                 des_file = dir_path + "/" + re.escape(data) + ".json"
    #                 with open(des_file, "w+") as jsonfile:
    #                     jsonfile.write(json.dumps(intermediate_data[type][categories][data]))

    def intermediate_transform_v2(self, json_data):
        inter_data = {}
        inter_data[self.ALL_MANGA] = {}
        inter_data[self.ALL_ANIME] = {}
        for data in json_data:
            media = data  # TV, OVA, MOVIE , MANGA ,MAGAZINE...
            if media not in inter_data:
                inter_data[media] = {}
                inter_data[media][self.ALL] = {}

            for anime in json_data[data]:
                genres = [self.UNKNOWN_GENRE]
                themes = [self.UNKNOWN_THEME]
                anime_name = anime[self.ATTR_NAME]
                anime_rating = anime[self.TAG_RATING]
                anime_image = anime[self.TAG_ATTR_TYPE_PICTURE]
                anime_summary = anime[self.TAG_ATTR_TYPE_SUMMARY]
                anime_links = "TBA"
                anime_details = self.gen_zoom_node(anime_summary, anime_image, anime_rating)
                self.all_anime_details[anime_name] = self.gen_anime_details_node(anime_summary, anime_image,
                                                                                 anime_links, anime_rating, [])
                if media in self.MANGA_TYPE:
                    if media not in inter_data[self.ALL_MANGA]:
                        inter_data[self.ALL_MANGA][media] = {}
                    inter_data[self.ALL_MANGA][media][anime_name] = anime_details
                else:
                    if media not in inter_data[self.ALL_ANIME]:
                        inter_data[self.ALL_ANIME][media] = {}
                    inter_data[self.ALL_ANIME][media][anime_name] = anime_details

                if len(anime[self.ATTR_GENRE]) > 0:
                    genres = anime[self.ATTR_GENRE]
                if len(anime[self.ATTR_THEMES]) > 0:
                    themes = anime[self.ATTR_THEMES]
                for genre in genres:

                    if genre not in inter_data[media][self.ALL]:
                        inter_data[media][self.ALL][genre] = {}
                    # add the anime to ALL in the genre hierarchy
                    inter_data[media][self.ALL][genre][anime_name] = anime_details

                    # if media in self.MANGA_TYPE:
                    #     if genre not in inter_data[self.ALL_MANGA]:
                    #         inter_data[self.ALL_MANGA][genre] = {}
                    #     inter_data[self.ALL_MANGA][genre][anime_name] = anime_details
                    # else:
                    #     if genre not in inter_data[self.ALL_ANIME]:
                    #         inter_data[self.ALL_ANIME][genre] = {}
                    #     inter_data[self.ALL_ANIME][genre][anime_name] = anime_details

                    if genre not in inter_data[media]:
                        inter_data[media][genre] = {}
                        inter_data[media][genre][self.ALL] = {}
                    for theme in themes:
                        if theme not in inter_data[media][genre][self.ALL]:
                            inter_data[media][genre][self.ALL][theme] = {}
                        # add the anime to ALL in the genre hierarchy
                        inter_data[media][genre][self.ALL][theme][anime_name] = anime_details

                        if theme not in inter_data[media][genre]:
                            inter_data[media][genre][theme] = {}
                        inter_data[media][genre][theme][anime_name] = anime_details
        self.gen_overview_forced_layout(inter_data)

    def gen_overview_forced_layout(self, intermediate_data_v2):
        root = self.ROOT_PATH
        anime_media = {}
        manga_media = {}
        anime_all_genre = {}
        manga_all_genre = {}
        anime_all_theme = {}
        manga_all_theme = {}

        for media in intermediate_data_v2:

            if media == self.ALL_ANIME:
                path = root + "/" + self.ANIME
                self.create_anime_all_json(intermediate_data_v2[media], path, self.ANIME)
            elif media == self.ALL_MANGA:
                path = root + "/" + self.MANGA
                self.create_anime_all_json(intermediate_data_v2[media], path, self.MANGA)
            else:
                category = self.ANIME
                if media in self.MANGA_TYPE:
                    category = self.MANGA
                if category == self.ANIME:
                    anime_media[media] = {}
                else:
                    manga_media[media] = {}

                for genre in intermediate_data_v2[media]:
                    if category == self.ANIME:
                        anime_all_genre[genre] = {}
                    else:
                        manga_all_genre[genre] = {}
                    if genre == "all":
                        path = root + "/" + category + "/" + media + "/"
                        self.create_anime_all_json(intermediate_data_v2[media][genre], path, category, media)
                    else:
                        for theme in intermediate_data_v2[media][genre]:

                            if category == self.ANIME:
                                anime_all_theme[theme] = {}
                            else:
                                manga_all_theme[theme] = {}

                            path = root + "/" + category + "/" + media + "/" + genre.replace("/",
                                                                                             "") + "/" + theme.replace(
                                "/",
                                "")
                            if theme == "all":
                                path = root + "/" + category + "/" + media + "/" + genre.replace("/", "")
                                self.create_anime_all_json(intermediate_data_v2[media][genre][theme], path, category,
                                                           media,
                                                           genre)
                            else:
                                self.create_anime_json(intermediate_data_v2[media][genre][theme], path, category,
                                                       media,
                                                       genre, theme)
        # for anime data
        path = root + "/" + self.ANIME
        self.create_file(path + "/media.json", anime_media)
        self.create_file(path + "/theme.json", anime_all_theme)
        self.create_file(path + "/genre.json", anime_all_genre)

        # for Manga data
        path = root + "/" + self.MANGA
        self.create_file(path + "/media.json", manga_media)
        self.create_file(path + "/theme.json", manga_all_theme)
        self.create_file(path + "/genre.json", manga_all_genre)

        self.create_file(self.ROOT_PATH + "/info.json", self.all_anime_details)

    def create_anime_json(self, animes, path, category, media=None, genre=None, theme=None):
        self.create_dir(path)
        des_anime_file = path + "/" + "anime.json"
        des_rating_file = path + "/" + "rating.json"
        root_json = []
        rating_data = []
        rating_set = set()
        animes_list = animes.keys()[:self.LIMIT]
        print "***********************************************"
        print len(animes_list)
        print "***********************************************"
        for key in animes_list:
            inter_list = animes_list[:]
            inter_list.remove(key)
            rating_val = float(animes[key][self.TAG_RATING])
            count = 0
            maxCount = 1
            for json_data in self.all_anime_details[key][self.ANIME_DETAILS_SIMILAR]:
                if json_data[self.ANIME_DETAILS_SIMILAR] in inter_list:
                    inter_list.remove(json_data[self.ANIME_DETAILS_SIMILAR])

            for inter in inter_list:
                inter_rating = float(animes[inter][self.TAG_RATING])
                if inter_rating > 0 and rating_val > 0 and inter_rating <= rating_val:
                    print str(inter_rating) + "  " + str(rating_val)
                    self.all_anime_details[key][self.ANIME_DETAILS_SIMILAR].append(
                        {self.NAME: inter, self.ANIME_DETAILS_SIMILAR: 3})
                    count += 1
                if count >= maxCount:
                    break
            if key not in rating_set:
                rating_set.add(key)
                rating_data.append(self.gen_leaf_rating_node(key, animes[key][self.TAG_RATING]))
            root_json.append(self.gen_leaf_anime_node(key, "isMovie"))

        if theme:
            root_json = self.gen_default_node(theme, "isTheme", root_json)
        if genre:
            root_json = self.gen_default_node(genre, "isGenre", root_json)
        if media:
            root_json = self.gen_default_node(media, "isMedia", root_json)
        root_json = self.gen_default_node(category, "isRoot", root_json)

        rating_data = sorted(rating_data, key=lambda k: k[self.TAG_RATING], reverse=True)

        self.create_file(des_anime_file, root_json)
        self.create_file(des_rating_file, {self.RATINGS: rating_data})

    def create_anime_all_json(self, animes, path, category, media=None, genre=None):
        self.create_dir(path)
        des_anime_file = path + "/" + "anime.json"
        des_rating_file = path + "/" + "rating.json"
        root_json = []
        rating_data = []
        rating_set = set()
        for parent in animes.keys():
            parentType = "isTheme"
            if not genre:
                parentType = "isGenre"
            if not media:
                parentType = "isMedia"
            anime_json = []
            for key in animes[parent].keys()[:self.LIMIT]:
                anime_json.append(self.gen_leaf_anime_node(key, "isMovie"))

                inter_list = animes[parent].keys()
                inter_list.remove(key)
                for json_data in self.all_anime_details[key][self.ANIME_DETAILS_SIMILAR]:
                    if json_data[self.ANIME_DETAILS_SIMILAR] in inter_list:
                        inter_list.remove(json_data[self.ANIME_DETAILS_SIMILAR])
                rating_val = float(animes[parent][key][self.TAG_RATING])
                maxCount1 = 1
                maxCount2 = 1
                count1 = 0
                count2 = 0
                for inter in inter_list:
                    inter_rating = float(animes[parent][inter][self.TAG_RATING])
                    if inter_rating > 0 and rating_val > 0 and inter_rating <= rating_val:
                        if genre and count2 < maxCount2:
                            self.all_anime_details[key][self.ANIME_DETAILS_SIMILAR].append(
                                {self.NAME: inter, self.ANIME_DETAILS_SIMILAR: 2})
                            count2 += 1

                        if not genre and media and count1 < maxCount1:
                            self.all_anime_details[key][self.ANIME_DETAILS_SIMILAR].append(
                                {self.NAME: inter, self.ANIME_DETAILS_SIMILAR: 1})
                            count1 += 1
                    if count1 >= maxCount1 or count2 >= maxCount2:
                        break

                if key not in rating_set:
                    rating_set.add(key)
                    rating_data.append(self.gen_leaf_rating_node(key, animes[parent][key][self.TAG_RATING]))
            root_json.append(self.gen_default_node(parent, parentType, anime_json))

        if genre:
            root_json = self.gen_default_node(genre, "isGenre", root_json)
        if media:
            root_json = self.gen_default_node(media, "isMedia", root_json)
        root_json = self.gen_default_node(category, "isRoot", root_json)

        rating_data = sorted(rating_data, key=lambda k: k[self.TAG_RATING], reverse=True)

        self.create_file(des_anime_file, root_json)
        self.create_file(des_rating_file, {self.RATINGS: rating_data})

    def create_file(self, des_file, dict_data):
        with open(des_file, "w+") as jsonfile:
            # jsonfile.write(json.dumps(intermediate_data_v2[media][genre][theme]))
            jsonfile.write(json.dumps(dict_data))

    def create_dir(self, dir_name):
        import os
        if not os.path.exists(dir_name):
            os.makedirs(dir_name)


if __name__ == "__main__":
    transform = Transform()
    # print transform.xml_to_json("animes.xml")

    xml_dir = "/home/kannan/datavis/vitches/api/anime_xmls"
    des_dir = "/home/kannan/datavis/vitches/api/anime_json"

    transform.parse_all_files(xml_dir, des_dir, False)
