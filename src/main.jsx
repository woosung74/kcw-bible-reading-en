import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowLeft, BookOpen, CalendarDays, Check, CheckCircle2, ChevronLeft, ChevronRight, Circle, Heart, Home, RotateCcw, Sparkles, Sunrise, Trophy } from 'lucide-react';
import { allBooks, TOTAL_CHAPTERS } from './bibleData';
import './styles.css';
import Preferences from './Preferences.jsx';
import Journal, { JournalShortcut, CalendarJournalButton } from './Journal.jsx';
import { useJournal } from './useJournal.js';
import { NotebookPen } from 'lucide-react';

const STORAGE_KEY = 'kcw-bible-progress-en-v1';
const DATES_KEY = 'kcw-bible-reading-dates-en-v1';
const ROUNDS_KEY = 'kcw-bible-completed-rounds-en-v1';
const ROUND_AWARDED_KEY = 'kcw-bible-round-awarded-en-v1';
const HISTORY_KEY = 'kcw-bible-reading-history-en-v1';
const JOURNAL_KEY = 'kcw-bible-journal-en-v1';
const BACKUP_KEYS = [STORAGE_KEY, DATES_KEY, ROUNDS_KEY, ROUND_AWARDED_KEY, HISTORY_KEY];
const BASE_URL = import.meta.env.BASE_URL;
const DAILY_VERSES = [
  {
    "book": 18,
    "chapter": 119,
    "verse": 1,
    "text": "א ALEPH. Blessed are the undefiled in the way, who walk in the law of the Lord."
  },
  {
    "book": 19,
    "chapter": 3,
    "verse": 1,
    "text": "My son, forget not my law; but let thine heart keep my commandments:"
  },
  {
    "book": 39,
    "chapter": 5,
    "verse": 1,
    "text": "And seeing the multitudes, he went up into a mountain: and when he was set, his disciples came unto him:"
  },
  {
    "book": 44,
    "chapter": 12,
    "verse": 1,
    "text": "I beseech you therefore, brethren, by the mercies of God, that ye present your bodies a living sacrifice, holy, acceptable unto God, which is your reasonable service."
  },
  {
    "book": 45,
    "chapter": 13,
    "verse": 1,
    "text": "Though I speak with the tongues of men and of angels, and have not charity, I am become as sounding brass, or a tinkling cymbal."
  },
  {
    "book": 42,
    "chapter": 15,
    "verse": 1,
    "text": "I am the true vine, and my Father is the husbandman."
  },
  {
    "book": 18,
    "chapter": 23,
    "verse": 1,
    "text": "A Psalm of David. The Lord is my shepherd; I shall not want."
  },
  {
    "book": 18,
    "chapter": 121,
    "verse": 1,
    "text": "A Song of degrees. I will lift up mine eyes unto the hills, from whence cometh my help."
  },
  {
    "book": 49,
    "chapter": 4,
    "verse": 1,
    "text": "Therefore, my brethren dearly beloved and longed for, my joy and crown, so stand fast in the Lord, my dearly beloved."
  },
  {
    "book": 18,
    "chapter": 91,
    "verse": 1,
    "text": "He that dwelleth in the secret place of the most High shall abide under the shadow of the Almighty."
  },
  {
    "book": 19,
    "chapter": 4,
    "verse": 1,
    "text": "Hear, ye children, the instruction of a father, and attend to know understanding."
  },
  {
    "book": 39,
    "chapter": 6,
    "verse": 1,
    "text": "Take heed that ye do not your alms before men, to be seen of them: otherwise ye have no reward of your Father which is in heaven."
  },
  {
    "book": 42,
    "chapter": 14,
    "verse": 1,
    "text": "Let not your heart be troubled: ye believe in God, believe also in me."
  },
  {
    "book": 18,
    "chapter": 119,
    "verse": 2,
    "text": "Blessed are they that keep his testimonies, and that seek him with the whole heart."
  },
  {
    "book": 19,
    "chapter": 3,
    "verse": 2,
    "text": "For length of days, and long life, and peace, shall they add to thee."
  },
  {
    "book": 39,
    "chapter": 5,
    "verse": 2,
    "text": "And he opened his mouth, and taught them, saying,"
  },
  {
    "book": 44,
    "chapter": 12,
    "verse": 2,
    "text": "And be not conformed to this world: but be ye transformed by the renewing of your mind, that ye may prove what is that good, and acceptable, and perfect, will of God."
  },
  {
    "book": 45,
    "chapter": 13,
    "verse": 2,
    "text": "And though I have the gift of prophecy, and understand all mysteries, and all knowledge; and though I have all faith, so that I could remove mountains, and have not charity, I am nothing."
  },
  {
    "book": 42,
    "chapter": 15,
    "verse": 2,
    "text": "Every branch in me that beareth not fruit he taketh away: and every branch that beareth fruit, he purgeth it, that it may bring forth more fruit."
  },
  {
    "book": 18,
    "chapter": 23,
    "verse": 2,
    "text": "He maketh me to lie down in green pastures: he leadeth me beside the still waters."
  },
  {
    "book": 18,
    "chapter": 121,
    "verse": 2,
    "text": "My help cometh from the Lord, which made heaven and earth."
  },
  {
    "book": 49,
    "chapter": 4,
    "verse": 2,
    "text": "I beseech Euodias, and beseech Syntyche, that they be of the same mind in the Lord."
  },
  {
    "book": 18,
    "chapter": 91,
    "verse": 2,
    "text": "I will say of the Lord, He is my refuge and my fortress: my God; in him will I trust."
  },
  {
    "book": 19,
    "chapter": 4,
    "verse": 2,
    "text": "For I give you good doctrine, forsake ye not my law."
  },
  {
    "book": 39,
    "chapter": 6,
    "verse": 2,
    "text": "Therefore when thou doest thine alms, do not sound a trumpet before thee, as the hypocrites do in the synagogues and in the streets, that they may have glory of men. Verily I say unto you, They have their reward."
  },
  {
    "book": 42,
    "chapter": 14,
    "verse": 2,
    "text": "In my Father’s house are many mansions: if it were not so, I would have told you. I go to prepare a place for you."
  },
  {
    "book": 18,
    "chapter": 119,
    "verse": 3,
    "text": "They also do no iniquity: they walk in his ways."
  },
  {
    "book": 19,
    "chapter": 3,
    "verse": 3,
    "text": "Let not mercy and truth forsake thee: bind them about thy neck; write them upon the table of thine heart:"
  },
  {
    "book": 39,
    "chapter": 5,
    "verse": 3,
    "text": "Blessed are the poor in spirit: for theirs is the kingdom of heaven."
  },
  {
    "book": 44,
    "chapter": 12,
    "verse": 3,
    "text": "For I say, through the grace given unto me, to every man that is among you, not to think of himself more highly than he ought to think; but to think soberly, according as God hath dealt to every man the measure of faith."
  },
  {
    "book": 45,
    "chapter": 13,
    "verse": 3,
    "text": "And though I bestow all my goods to feed the poor, and though I give my body to be burned, and have not charity, it profiteth me nothing."
  },
  {
    "book": 42,
    "chapter": 15,
    "verse": 3,
    "text": "Now ye are clean through the word which I have spoken unto you."
  },
  {
    "book": 18,
    "chapter": 23,
    "verse": 3,
    "text": "He restoreth my soul: he leadeth me in the paths of righteousness for his name’s sake."
  },
  {
    "book": 18,
    "chapter": 121,
    "verse": 3,
    "text": "He will not suffer thy foot to be moved: he that keepeth thee will not slumber."
  },
  {
    "book": 49,
    "chapter": 4,
    "verse": 3,
    "text": "And I intreat thee also, true yokefellow, help those women which laboured with me in the gospel, with Clement also, and with other my fellowlabourers, whose names are in the book of life."
  },
  {
    "book": 18,
    "chapter": 91,
    "verse": 3,
    "text": "Surely he shall deliver thee from the snare of the fowler, and from the noisome pestilence."
  },
  {
    "book": 19,
    "chapter": 4,
    "verse": 3,
    "text": "For I was my father’s son, tender and only beloved in the sight of my mother."
  },
  {
    "book": 39,
    "chapter": 6,
    "verse": 3,
    "text": "But when thou doest alms, let not thy left hand know what thy right hand doeth:"
  },
  {
    "book": 42,
    "chapter": 14,
    "verse": 3,
    "text": "And if I go and prepare a place for you, I will come again, and receive you unto myself; that where I am, there ye may be also."
  },
  {
    "book": 18,
    "chapter": 119,
    "verse": 4,
    "text": "Thou hast commanded us to keep thy precepts diligently."
  },
  {
    "book": 19,
    "chapter": 3,
    "verse": 4,
    "text": "So shalt thou find favour and good understanding in the sight of God and man."
  },
  {
    "book": 39,
    "chapter": 5,
    "verse": 4,
    "text": "Blessed are they that mourn: for they shall be comforted."
  },
  {
    "book": 44,
    "chapter": 12,
    "verse": 4,
    "text": "For as we have many members in one body, and all members have not the same office:"
  },
  {
    "book": 45,
    "chapter": 13,
    "verse": 4,
    "text": "Charity suffereth long, and is kind; charity envieth not; charity vaunteth not itself, is not puffed up,"
  },
  {
    "book": 42,
    "chapter": 15,
    "verse": 4,
    "text": "Abide in me, and I in you. As the branch cannot bear fruit of itself, except it abide in the vine; no more can ye, except ye abide in me."
  },
  {
    "book": 18,
    "chapter": 23,
    "verse": 4,
    "text": "Yea, though I walk through the valley of the shadow of death, I will fear no evil: for thou art with me; thy rod and thy staff they comfort me."
  },
  {
    "book": 18,
    "chapter": 121,
    "verse": 4,
    "text": "Behold, he that keepeth Israel shall neither slumber nor sleep."
  },
  {
    "book": 49,
    "chapter": 4,
    "verse": 4,
    "text": "Rejoice in the Lord alway: and again I say, Rejoice."
  },
  {
    "book": 18,
    "chapter": 91,
    "verse": 4,
    "text": "He shall cover thee with his feathers, and under his wings shalt thou trust: his truth shall be thy shield and buckler."
  },
  {
    "book": 19,
    "chapter": 4,
    "verse": 4,
    "text": "He taught me also, and said unto me, Let thine heart retain my words: keep my commandments, and live."
  },
  {
    "book": 39,
    "chapter": 6,
    "verse": 4,
    "text": "That thine alms may be in secret: and thy Father which seeth in secret himself shall reward thee openly."
  },
  {
    "book": 42,
    "chapter": 14,
    "verse": 4,
    "text": "And whither I go ye know, and the way ye know."
  },
  {
    "book": 18,
    "chapter": 119,
    "verse": 5,
    "text": "O that my ways were directed to keep thy statutes!"
  },
  {
    "book": 19,
    "chapter": 3,
    "verse": 5,
    "text": "Trust in the Lord with all thine heart; and lean not unto thine own understanding."
  },
  {
    "book": 39,
    "chapter": 5,
    "verse": 5,
    "text": "Blessed are the meek: for they shall inherit the earth."
  },
  {
    "book": 44,
    "chapter": 12,
    "verse": 5,
    "text": "So we, being many, are one body in Christ, and every one members one of another."
  },
  {
    "book": 45,
    "chapter": 13,
    "verse": 5,
    "text": "Doth not behave itself unseemly, seeketh not her own, is not easily provoked, thinketh no evil;"
  },
  {
    "book": 42,
    "chapter": 15,
    "verse": 5,
    "text": "I am the vine, ye are the branches: He that abideth in me, and I in him, the same bringeth forth much fruit: for without me ye can do nothing."
  },
  {
    "book": 18,
    "chapter": 23,
    "verse": 5,
    "text": "Thou preparest a table before me in the presence of mine enemies: thou anointest my head with oil; my cup runneth over."
  },
  {
    "book": 18,
    "chapter": 121,
    "verse": 5,
    "text": "The Lord is thy keeper: the Lord is thy shade upon thy right hand."
  },
  {
    "book": 49,
    "chapter": 4,
    "verse": 5,
    "text": "Let your moderation be known unto all men. The Lord is at hand."
  },
  {
    "book": 18,
    "chapter": 91,
    "verse": 5,
    "text": "Thou shalt not be afraid for the terror by night; nor for the arrow that flieth by day;"
  },
  {
    "book": 19,
    "chapter": 4,
    "verse": 5,
    "text": "Get wisdom, get understanding: forget it not; neither decline from the words of my mouth."
  },
  {
    "book": 39,
    "chapter": 6,
    "verse": 5,
    "text": "And when thou prayest, thou shalt not be as the hypocrites are: for they love to pray standing in the synagogues and in the corners of the streets, that they may be seen of men. Verily I say unto you, They have their reward."
  },
  {
    "book": 42,
    "chapter": 14,
    "verse": 5,
    "text": "Thomas saith unto him, Lord, we know not whither thou goest; and how can we know the way?"
  },
  {
    "book": 18,
    "chapter": 119,
    "verse": 6,
    "text": "Then shall I not be ashamed, when I have respect unto all thy commandments."
  },
  {
    "book": 19,
    "chapter": 3,
    "verse": 6,
    "text": "In all thy ways acknowledge him, and he shall direct thy paths."
  },
  {
    "book": 39,
    "chapter": 5,
    "verse": 6,
    "text": "Blessed are they which do hunger and thirst after righteousness: for they shall be filled."
  },
  {
    "book": 44,
    "chapter": 12,
    "verse": 6,
    "text": "Having then gifts differing according to the grace that is given to us, whether prophecy, let us prophesy according to the proportion of faith;"
  },
  {
    "book": 45,
    "chapter": 13,
    "verse": 6,
    "text": "Rejoiceth not in iniquity, but rejoiceth in the truth;"
  },
  {
    "book": 42,
    "chapter": 15,
    "verse": 6,
    "text": "If a man abide not in me, he is cast forth as a branch, and is withered; and men gather them, and cast them into the fire, and they are burned."
  },
  {
    "book": 18,
    "chapter": 23,
    "verse": 6,
    "text": "Surely goodness and mercy shall follow me all the days of my life: and I will dwell in the house of the Lord for ever."
  },
  {
    "book": 18,
    "chapter": 121,
    "verse": 6,
    "text": "The sun shall not smite thee by day, nor the moon by night."
  },
  {
    "book": 49,
    "chapter": 4,
    "verse": 6,
    "text": "Be careful for nothing; but in every thing by prayer and supplication with thanksgiving let your requests be made known unto God."
  },
  {
    "book": 18,
    "chapter": 91,
    "verse": 6,
    "text": "Nor for the pestilence that walketh in darkness; nor for the destruction that wasteth at noonday."
  },
  {
    "book": 19,
    "chapter": 4,
    "verse": 6,
    "text": "Forsake her not, and she shall preserve thee: love her, and she shall keep thee."
  },
  {
    "book": 39,
    "chapter": 6,
    "verse": 6,
    "text": "But thou, when thou prayest, enter into thy closet, and when thou hast shut thy door, pray to thy Father which is in secret; and thy Father which seeth in secret shall reward thee openly."
  },
  {
    "book": 42,
    "chapter": 14,
    "verse": 6,
    "text": "Jesus saith unto him, I am the way, the truth, and the life: no man cometh unto the Father, but by me."
  },
  {
    "book": 18,
    "chapter": 119,
    "verse": 7,
    "text": "I will praise thee with uprightness of heart, when I shall have learned thy righteous judgments."
  },
  {
    "book": 19,
    "chapter": 3,
    "verse": 7,
    "text": "Be not wise in thine own eyes: fear the Lord, and depart from evil."
  },
  {
    "book": 39,
    "chapter": 5,
    "verse": 7,
    "text": "Blessed are the merciful: for they shall obtain mercy."
  },
  {
    "book": 44,
    "chapter": 12,
    "verse": 7,
    "text": "Or ministry, let us wait on our ministering: or he that teacheth, on teaching;"
  },
  {
    "book": 45,
    "chapter": 13,
    "verse": 7,
    "text": "Beareth all things, believeth all things, hopeth all things, endureth all things."
  },
  {
    "book": 42,
    "chapter": 15,
    "verse": 7,
    "text": "If ye abide in me, and my words abide in you, ye shall ask what ye will, and it shall be done unto you."
  },
  {
    "book": 18,
    "chapter": 121,
    "verse": 7,
    "text": "The Lord shall preserve thee from all evil: he shall preserve thy soul."
  },
  {
    "book": 49,
    "chapter": 4,
    "verse": 7,
    "text": "And the peace of God, which passeth all understanding, shall keep your hearts and minds through Christ Jesus."
  },
  {
    "book": 18,
    "chapter": 91,
    "verse": 7,
    "text": "A thousand shall fall at thy side, and ten thousand at thy right hand; but it shall not come nigh thee."
  },
  {
    "book": 19,
    "chapter": 4,
    "verse": 7,
    "text": "Wisdom is the principal thing; therefore get wisdom: and with all thy getting get understanding."
  },
  {
    "book": 39,
    "chapter": 6,
    "verse": 7,
    "text": "But when ye pray, use not vain repetitions, as the heathen do: for they think that they shall be heard for their much speaking."
  },
  {
    "book": 42,
    "chapter": 14,
    "verse": 7,
    "text": "If ye had known me, ye should have known my Father also: and from henceforth ye know him, and have seen him."
  },
  {
    "book": 18,
    "chapter": 119,
    "verse": 8,
    "text": "I will keep thy statutes: O forsake me not utterly."
  },
  {
    "book": 19,
    "chapter": 3,
    "verse": 8,
    "text": "It shall be health to thy navel, and marrow to thy bones."
  },
  {
    "book": 39,
    "chapter": 5,
    "verse": 8,
    "text": "Blessed are the pure in heart: for they shall see God."
  },
  {
    "book": 44,
    "chapter": 12,
    "verse": 8,
    "text": "Or he that exhorteth, on exhortation: he that giveth, let him do it with simplicity; he that ruleth, with diligence; he that sheweth mercy, with cheerfulness."
  },
  {
    "book": 45,
    "chapter": 13,
    "verse": 8,
    "text": "Charity never faileth: but whether there be prophecies, they shall fail; whether there be tongues, they shall cease; whether there be knowledge, it shall vanish away."
  },
  {
    "book": 42,
    "chapter": 15,
    "verse": 8,
    "text": "Herein is my Father glorified, that ye bear much fruit; so shall ye be my disciples."
  },
  {
    "book": 18,
    "chapter": 121,
    "verse": 8,
    "text": "The Lord shall preserve thy going out and thy coming in from this time forth, and even for evermore."
  },
  {
    "book": 49,
    "chapter": 4,
    "verse": 8,
    "text": "Finally, brethren, whatsoever things are true, whatsoever things are honest, whatsoever things are just, whatsoever things are pure, whatsoever things are lovely, whatsoever things are of good report; if there be any virtue, and if there be any praise, think on these things."
  },
  {
    "book": 18,
    "chapter": 91,
    "verse": 8,
    "text": "Only with thine eyes shalt thou behold and see the reward of the wicked."
  },
  {
    "book": 19,
    "chapter": 4,
    "verse": 8,
    "text": "Exalt her, and she shall promote thee: she shall bring thee to honour, when thou dost embrace her."
  },
  {
    "book": 39,
    "chapter": 6,
    "verse": 8,
    "text": "Be not ye therefore like unto them: for your Father knoweth what things ye have need of, before ye ask him."
  },
  {
    "book": 42,
    "chapter": 14,
    "verse": 8,
    "text": "Philip saith unto him, Lord, shew us the Father, and it sufficeth us."
  },
  {
    "book": 18,
    "chapter": 119,
    "verse": 9,
    "text": "ב BETH. Wherewithal shall a young man cleanse his way? by taking heed thereto according to thy word."
  },
  {
    "book": 19,
    "chapter": 3,
    "verse": 9,
    "text": "Honour the Lord with thy substance, and with the firstfruits of all thine increase:"
  },
  {
    "book": 39,
    "chapter": 5,
    "verse": 9,
    "text": "Blessed are the peacemakers: for they shall be called the children of God."
  },
  {
    "book": 44,
    "chapter": 12,
    "verse": 9,
    "text": "Let love be without dissimulation. Abhor that which is evil; cleave to that which is good."
  },
  {
    "book": 45,
    "chapter": 13,
    "verse": 9,
    "text": "For we know in part, and we prophesy in part."
  },
  {
    "book": 42,
    "chapter": 15,
    "verse": 9,
    "text": "As the Father hath loved me, so have I loved you: continue ye in my love."
  },
  {
    "book": 49,
    "chapter": 4,
    "verse": 9,
    "text": "Those things, which ye have both learned, and received, and heard, and seen in me, do: and the God of peace shall be with you."
  },
  {
    "book": 18,
    "chapter": 91,
    "verse": 9,
    "text": "Because thou hast made the Lord, which is my refuge, even the most High, thy habitation;"
  },
  {
    "book": 19,
    "chapter": 4,
    "verse": 9,
    "text": "She shall give to thine head an ornament of grace: a crown of glory shall she deliver to thee."
  },
  {
    "book": 39,
    "chapter": 6,
    "verse": 9,
    "text": "After this manner therefore pray ye: Our Father which art in heaven, Hallowed be thy name."
  },
  {
    "book": 42,
    "chapter": 14,
    "verse": 9,
    "text": "Jesus saith unto him, Have I been so long time with you, and yet hast thou not known me, Philip? he that hath seen me hath seen the Father; and how sayest thou then, Shew us the Father?"
  },
  {
    "book": 18,
    "chapter": 119,
    "verse": 10,
    "text": "With my whole heart have I sought thee: O let me not wander from thy commandments."
  },
  {
    "book": 19,
    "chapter": 3,
    "verse": 10,
    "text": "So shall thy barns be filled with plenty, and thy presses shall burst out with new wine."
  },
  {
    "book": 39,
    "chapter": 5,
    "verse": 10,
    "text": "Blessed are they which are persecuted for righteousness’ sake: for theirs is the kingdom of heaven."
  },
  {
    "book": 44,
    "chapter": 12,
    "verse": 10,
    "text": "Be kindly affectioned one to another with brotherly love; in honour preferring one another;"
  },
  {
    "book": 45,
    "chapter": 13,
    "verse": 10,
    "text": "But when that which is perfect is come, then that which is in part shall be done away."
  },
  {
    "book": 42,
    "chapter": 15,
    "verse": 10,
    "text": "If ye keep my commandments, ye shall abide in my love; even as I have kept my Father’s commandments, and abide in his love."
  },
  {
    "book": 49,
    "chapter": 4,
    "verse": 10,
    "text": "But I rejoiced in the Lord greatly, that now at the last your care of me hath flourished again; wherein ye were also careful, but ye lacked opportunity."
  },
  {
    "book": 18,
    "chapter": 91,
    "verse": 10,
    "text": "There shall no evil befall thee, neither shall any plague come nigh thy dwelling."
  },
  {
    "book": 19,
    "chapter": 4,
    "verse": 10,
    "text": "Hear, O my son, and receive my sayings; and the years of thy life shall be many."
  },
  {
    "book": 39,
    "chapter": 6,
    "verse": 10,
    "text": "Thy kingdom come. Thy will be done in earth, as it is in heaven."
  },
  {
    "book": 42,
    "chapter": 14,
    "verse": 10,
    "text": "Believest thou not that I am in the Father, and the Father in me? the words that I speak unto you I speak not of myself: but the Father that dwelleth in me, he doeth the works."
  },
  {
    "book": 18,
    "chapter": 119,
    "verse": 11,
    "text": "Thy word have I hid in mine heart, that I might not sin against thee."
  },
  {
    "book": 19,
    "chapter": 3,
    "verse": 11,
    "text": "My son, despise not the chastening of the Lord; neither be weary of his correction:"
  },
  {
    "book": 39,
    "chapter": 5,
    "verse": 11,
    "text": "Blessed are ye, when men shall revile you, and persecute you, and shall say all manner of evil against you falsely, for my sake."
  },
  {
    "book": 44,
    "chapter": 12,
    "verse": 11,
    "text": "Not slothful in business; fervent in spirit; serving the Lord;"
  },
  {
    "book": 45,
    "chapter": 13,
    "verse": 11,
    "text": "When I was a child, I spake as a child, I understood as a child, I thought as a child: but when I became a man, I put away childish things."
  },
  {
    "book": 42,
    "chapter": 15,
    "verse": 11,
    "text": "These things have I spoken unto you, that my joy might remain in you, and that your joy might be full."
  },
  {
    "book": 49,
    "chapter": 4,
    "verse": 11,
    "text": "Not that I speak in respect of want: for I have learned, in whatsoever state I am, therewith to be content."
  },
  {
    "book": 18,
    "chapter": 91,
    "verse": 11,
    "text": "For he shall give his angels charge over thee, to keep thee in all thy ways."
  },
  {
    "book": 19,
    "chapter": 4,
    "verse": 11,
    "text": "I have taught thee in the way of wisdom; I have led thee in right paths."
  },
  {
    "book": 39,
    "chapter": 6,
    "verse": 11,
    "text": "Give us this day our daily bread."
  },
  {
    "book": 42,
    "chapter": 14,
    "verse": 11,
    "text": "Believe me that I am in the Father, and the Father in me: or else believe me for the very works’ sake."
  },
  {
    "book": 18,
    "chapter": 119,
    "verse": 12,
    "text": "Blessed art thou, O Lord: teach me thy statutes."
  },
  {
    "book": 19,
    "chapter": 3,
    "verse": 12,
    "text": "For whom the Lord loveth he correcteth; even as a father the son in whom he delighteth."
  },
  {
    "book": 39,
    "chapter": 5,
    "verse": 12,
    "text": "Rejoice, and be exceeding glad: for great is your reward in heaven: for so persecuted they the prophets which were before you."
  },
  {
    "book": 44,
    "chapter": 12,
    "verse": 12,
    "text": "Rejoicing in hope; patient in tribulation; continuing instant in prayer;"
  },
  {
    "book": 45,
    "chapter": 13,
    "verse": 12,
    "text": "For now we see through a glass, darkly; but then face to face: now I know in part; but then shall I know even as also I am known."
  },
  {
    "book": 42,
    "chapter": 15,
    "verse": 12,
    "text": "This is my commandment, That ye love one another, as I have loved you."
  },
  {
    "book": 49,
    "chapter": 4,
    "verse": 12,
    "text": "I know both how to be abased, and I know how to abound: every where and in all things I am instructed both to be full and to be hungry, both to abound and to suffer need."
  },
  {
    "book": 18,
    "chapter": 91,
    "verse": 12,
    "text": "They shall bear thee up in their hands, lest thou dash thy foot against a stone."
  },
  {
    "book": 19,
    "chapter": 4,
    "verse": 12,
    "text": "When thou goest, thy steps shall not be straitened; and when thou runnest, thou shalt not stumble."
  },
  {
    "book": 39,
    "chapter": 6,
    "verse": 12,
    "text": "And forgive us our debts, as we forgive our debtors."
  },
  {
    "book": 42,
    "chapter": 14,
    "verse": 12,
    "text": "Verily, verily, I say unto you, He that believeth on me, the works that I do shall he do also; and greater works than these shall he do; because I go unto my Father."
  },
  {
    "book": 18,
    "chapter": 119,
    "verse": 13,
    "text": "With my lips have I declared all the judgments of thy mouth."
  },
  {
    "book": 19,
    "chapter": 3,
    "verse": 13,
    "text": "Happy is the man that findeth wisdom, and the man that getteth understanding."
  },
  {
    "book": 39,
    "chapter": 5,
    "verse": 13,
    "text": "Ye are the salt of the earth: but if the salt have lost his savour, wherewith shall it be salted? it is thenceforth good for nothing, but to be cast out, and to be trodden under foot of men."
  },
  {
    "book": 44,
    "chapter": 12,
    "verse": 13,
    "text": "Distributing to the necessity of saints; given to hospitality."
  },
  {
    "book": 45,
    "chapter": 13,
    "verse": 13,
    "text": "And now abideth faith, hope, charity, these three; but the greatest of these is charity."
  },
  {
    "book": 42,
    "chapter": 15,
    "verse": 13,
    "text": "Greater love hath no man than this, that a man lay down his life for his friends."
  },
  {
    "book": 49,
    "chapter": 4,
    "verse": 13,
    "text": "I can do all things through Christ which strengtheneth me."
  },
  {
    "book": 18,
    "chapter": 91,
    "verse": 13,
    "text": "Thou shalt tread upon the lion and adder: the young lion and the dragon shalt thou trample under feet."
  },
  {
    "book": 19,
    "chapter": 4,
    "verse": 13,
    "text": "Take fast hold of instruction; let her not go: keep her; for she is thy life."
  },
  {
    "book": 39,
    "chapter": 6,
    "verse": 13,
    "text": "And lead us not into temptation, but deliver us from evil: For thine is the kingdom, and the power, and the glory, for ever. Amen."
  },
  {
    "book": 42,
    "chapter": 14,
    "verse": 13,
    "text": "And whatsoever ye shall ask in my name, that will I do, that the Father may be glorified in the Son."
  },
  {
    "book": 18,
    "chapter": 119,
    "verse": 14,
    "text": "I have rejoiced in the way of thy testimonies, as much as in all riches."
  },
  {
    "book": 19,
    "chapter": 3,
    "verse": 14,
    "text": "For the merchandise of it is better than the merchandise of silver, and the gain thereof than fine gold."
  },
  {
    "book": 39,
    "chapter": 5,
    "verse": 14,
    "text": "Ye are the light of the world. A city that is set on an hill cannot be hid."
  },
  {
    "book": 44,
    "chapter": 12,
    "verse": 14,
    "text": "Bless them which persecute you: bless, and curse not."
  },
  {
    "book": 42,
    "chapter": 15,
    "verse": 14,
    "text": "Ye are my friends, if ye do whatsoever I command you."
  },
  {
    "book": 49,
    "chapter": 4,
    "verse": 14,
    "text": "Notwithstanding ye have well done, that ye did communicate with my affliction."
  },
  {
    "book": 18,
    "chapter": 91,
    "verse": 14,
    "text": "Because he hath set his love upon me, therefore will I deliver him: I will set him on high, because he hath known my name."
  },
  {
    "book": 19,
    "chapter": 4,
    "verse": 14,
    "text": "Enter not into the path of the wicked, and go not in the way of evil men."
  },
  {
    "book": 39,
    "chapter": 6,
    "verse": 14,
    "text": "For if ye forgive men their trespasses, your heavenly Father will also forgive you:"
  },
  {
    "book": 42,
    "chapter": 14,
    "verse": 14,
    "text": "If ye shall ask any thing in my name, I will do it."
  },
  {
    "book": 18,
    "chapter": 119,
    "verse": 15,
    "text": "I will meditate in thy precepts, and have respect unto thy ways."
  },
  {
    "book": 19,
    "chapter": 3,
    "verse": 15,
    "text": "She is more precious than rubies: and all the things thou canst desire are not to be compared unto her."
  },
  {
    "book": 39,
    "chapter": 5,
    "verse": 15,
    "text": "Neither do men light a candle, and put it under a bushel, but on a candlestick; and it giveth light unto all that are in the house."
  },
  {
    "book": 44,
    "chapter": 12,
    "verse": 15,
    "text": "Rejoice with them that do rejoice, and weep with them that weep."
  },
  {
    "book": 42,
    "chapter": 15,
    "verse": 15,
    "text": "Henceforth I call you not servants; for the servant knoweth not what his lord doeth: but I have called you friends; for all things that I have heard of my Father I have made known unto you."
  },
  {
    "book": 49,
    "chapter": 4,
    "verse": 15,
    "text": "Now ye Philippians know also, that in the beginning of the gospel, when I departed from Macedonia, no church communicated with me as concerning giving and receiving, but ye only."
  },
  {
    "book": 18,
    "chapter": 91,
    "verse": 15,
    "text": "He shall call upon me, and I will answer him: I will be with him in trouble; I will deliver him, and honour him."
  },
  {
    "book": 19,
    "chapter": 4,
    "verse": 15,
    "text": "Avoid it, pass not by it, turn from it, and pass away."
  },
  {
    "book": 39,
    "chapter": 6,
    "verse": 15,
    "text": "But if ye forgive not men their trespasses, neither will your Father forgive your trespasses."
  },
  {
    "book": 42,
    "chapter": 14,
    "verse": 15,
    "text": "If ye love me, keep my commandments."
  },
  {
    "book": 18,
    "chapter": 119,
    "verse": 16,
    "text": "I will delight myself in thy statutes: I will not forget thy word."
  },
  {
    "book": 19,
    "chapter": 3,
    "verse": 16,
    "text": "Length of days is in her right hand; and in her left hand riches and honour."
  },
  {
    "book": 39,
    "chapter": 5,
    "verse": 16,
    "text": "Let your light so shine before men, that they may see your good works, and glorify your Father which is in heaven."
  },
  {
    "book": 44,
    "chapter": 12,
    "verse": 16,
    "text": "Be of the same mind one toward another. Mind not high things, but condescend to men of low estate. Be not wise in your own conceits."
  },
  {
    "book": 42,
    "chapter": 15,
    "verse": 16,
    "text": "Ye have not chosen me, but I have chosen you, and ordained you, that ye should go and bring forth fruit, and that your fruit should remain: that whatsoever ye shall ask of the Father in my name, he may give it you."
  },
  {
    "book": 49,
    "chapter": 4,
    "verse": 16,
    "text": "For even in Thessalonica ye sent once and again unto my necessity."
  },
  {
    "book": 18,
    "chapter": 91,
    "verse": 16,
    "text": "With long life will I satisfy him, and shew him my salvation."
  },
  {
    "book": 19,
    "chapter": 4,
    "verse": 16,
    "text": "For they sleep not, except they have done mischief; and their sleep is taken away, unless they cause some to fall."
  },
  {
    "book": 39,
    "chapter": 6,
    "verse": 16,
    "text": "Moreover when ye fast, be not, as the hypocrites, of a sad countenance: for they disfigure their faces, that they may appear unto men to fast. Verily I say unto you, They have their reward."
  },
  {
    "book": 42,
    "chapter": 14,
    "verse": 16,
    "text": "And I will pray the Father, and he shall give you another Comforter, that he may abide with you for ever;"
  },
  {
    "book": 18,
    "chapter": 119,
    "verse": 17,
    "text": "ג GIMEL. Deal bountifully with thy servant, that I may live, and keep thy word."
  },
  {
    "book": 19,
    "chapter": 3,
    "verse": 17,
    "text": "Her ways are ways of pleasantness, and all her paths are peace."
  },
  {
    "book": 39,
    "chapter": 5,
    "verse": 17,
    "text": "Think not that I am come to destroy the law, or the prophets: I am not come to destroy, but to fulfil."
  },
  {
    "book": 44,
    "chapter": 12,
    "verse": 17,
    "text": "Recompense to no man evil for evil. Provide things honest in the sight of all men."
  },
  {
    "book": 42,
    "chapter": 15,
    "verse": 17,
    "text": "These things I command you, that ye love one another."
  },
  {
    "book": 49,
    "chapter": 4,
    "verse": 17,
    "text": "Not because I desire a gift: but I desire fruit that may abound to your account."
  },
  {
    "book": 19,
    "chapter": 4,
    "verse": 17,
    "text": "For they eat the bread of wickedness, and drink the wine of violence."
  },
  {
    "book": 39,
    "chapter": 6,
    "verse": 17,
    "text": "But thou, when thou fastest, anoint thine head, and wash thy face;"
  },
  {
    "book": 42,
    "chapter": 14,
    "verse": 17,
    "text": "Even the Spirit of truth; whom the world cannot receive, because it seeth him not, neither knoweth him: but ye know him; for he dwelleth with you, and shall be in you."
  },
  {
    "book": 18,
    "chapter": 119,
    "verse": 18,
    "text": "Open thou mine eyes, that I may behold wondrous things out of thy law."
  },
  {
    "book": 19,
    "chapter": 3,
    "verse": 18,
    "text": "She is a tree of life to them that lay hold upon her: and happy is every one that retaineth her."
  },
  {
    "book": 39,
    "chapter": 5,
    "verse": 18,
    "text": "For verily I say unto you, Till heaven and earth pass, one jot or one tittle shall in no wise pass from the law, till all be fulfilled."
  },
  {
    "book": 44,
    "chapter": 12,
    "verse": 18,
    "text": "If it be possible, as much as lieth in you, live peaceably with all men."
  },
  {
    "book": 42,
    "chapter": 15,
    "verse": 18,
    "text": "If the world hate you, ye know that it hated me before it hated you."
  },
  {
    "book": 49,
    "chapter": 4,
    "verse": 18,
    "text": "But I have all, and abound: I am full, having received of Epaphroditus the things which were sent from you, an odour of a sweet smell, a sacrifice acceptable, wellpleasing to God."
  },
  {
    "book": 19,
    "chapter": 4,
    "verse": 18,
    "text": "But the path of the just is as the shining light, that shineth more and more unto the perfect day."
  },
  {
    "book": 39,
    "chapter": 6,
    "verse": 18,
    "text": "That thou appear not unto men to fast, but unto thy Father which is in secret: and thy Father, which seeth in secret, shall reward thee openly."
  },
  {
    "book": 42,
    "chapter": 14,
    "verse": 18,
    "text": "I will not leave you comfortless: I will come to you."
  },
  {
    "book": 18,
    "chapter": 119,
    "verse": 19,
    "text": "I am a stranger in the earth: hide not thy commandments from me."
  },
  {
    "book": 19,
    "chapter": 3,
    "verse": 19,
    "text": "The Lord by wisdom hath founded the earth; by understanding hath he established the heavens."
  },
  {
    "book": 39,
    "chapter": 5,
    "verse": 19,
    "text": "Whosoever therefore shall break one of these least commandments, and shall teach men so, he shall be called the least in the kingdom of heaven: but whosoever shall do and teach them, the same shall be called great in the kingdom of heaven."
  },
  {
    "book": 44,
    "chapter": 12,
    "verse": 19,
    "text": "Dearly beloved, avenge not yourselves, but rather give place unto wrath: for it is written, Vengeance is mine; I will repay, saith the Lord."
  },
  {
    "book": 42,
    "chapter": 15,
    "verse": 19,
    "text": "If ye were of the world, the world would love his own: but because ye are not of the world, but I have chosen you out of the world, therefore the world hateth you."
  },
  {
    "book": 49,
    "chapter": 4,
    "verse": 19,
    "text": "But my God shall supply all your need according to his riches in glory by Christ Jesus."
  },
  {
    "book": 19,
    "chapter": 4,
    "verse": 19,
    "text": "The way of the wicked is as darkness: they know not at what they stumble."
  },
  {
    "book": 39,
    "chapter": 6,
    "verse": 19,
    "text": "Lay not up for yourselves treasures upon earth, where moth and rust doth corrupt, and where thieves break through and steal:"
  },
  {
    "book": 42,
    "chapter": 14,
    "verse": 19,
    "text": "Yet a little while, and the world seeth me no more; but ye see me: because I live, ye shall live also."
  },
  {
    "book": 18,
    "chapter": 119,
    "verse": 20,
    "text": "My soul breaketh for the longing that it hath unto thy judgments at all times."
  },
  {
    "book": 19,
    "chapter": 3,
    "verse": 20,
    "text": "By his knowledge the depths are broken up, and the clouds drop down the dew."
  },
  {
    "book": 39,
    "chapter": 5,
    "verse": 20,
    "text": "For I say unto you, That except your righteousness shall exceed the righteousness of the scribes and Pharisees, ye shall in no case enter into the kingdom of heaven."
  },
  {
    "book": 44,
    "chapter": 12,
    "verse": 20,
    "text": "Therefore if thine enemy hunger, feed him; if he thirst, give him drink: for in so doing thou shalt heap coals of fire on his head."
  },
  {
    "book": 42,
    "chapter": 15,
    "verse": 20,
    "text": "Remember the word that I said unto you, The servant is not greater than his lord. If they have persecuted me, they will also persecute you; if they have kept my saying, they will keep yours also."
  },
  {
    "book": 49,
    "chapter": 4,
    "verse": 20,
    "text": "Now unto God and our Father be glory for ever and ever. Amen."
  },
  {
    "book": 19,
    "chapter": 4,
    "verse": 20,
    "text": "My son, attend to my words; incline thine ear unto my sayings."
  },
  {
    "book": 39,
    "chapter": 6,
    "verse": 20,
    "text": "But lay up for yourselves treasures in heaven, where neither moth nor rust doth corrupt, and where thieves do not break through nor steal:"
  },
  {
    "book": 42,
    "chapter": 14,
    "verse": 20,
    "text": "At that day ye shall know that I am in my Father, and ye in me, and I in you."
  },
  {
    "book": 18,
    "chapter": 119,
    "verse": 21,
    "text": "Thou hast rebuked the proud that are cursed, which do err from thy commandments."
  },
  {
    "book": 19,
    "chapter": 3,
    "verse": 21,
    "text": "My son, let not them depart from thine eyes: keep sound wisdom and discretion:"
  },
  {
    "book": 39,
    "chapter": 5,
    "verse": 21,
    "text": "Ye have heard that it was said by them of old time, Thou shalt not kill; and whosoever shall kill shall be in danger of the judgment:"
  },
  {
    "book": 44,
    "chapter": 12,
    "verse": 21,
    "text": "Be not overcome of evil, but overcome evil with good."
  },
  {
    "book": 42,
    "chapter": 15,
    "verse": 21,
    "text": "But all these things will they do unto you for my name’s sake, because they know not him that sent me."
  },
  {
    "book": 49,
    "chapter": 4,
    "verse": 21,
    "text": "Salute every saint in Christ Jesus. The brethren which are with me greet you."
  },
  {
    "book": 19,
    "chapter": 4,
    "verse": 21,
    "text": "Let them not depart from thine eyes; keep them in the midst of thine heart."
  },
  {
    "book": 39,
    "chapter": 6,
    "verse": 21,
    "text": "For where your treasure is, there will your heart be also."
  },
  {
    "book": 42,
    "chapter": 14,
    "verse": 21,
    "text": "He that hath my commandments, and keepeth them, he it is that loveth me: and he that loveth me shall be loved of my Father, and I will love him, and will manifest myself to him."
  },
  {
    "book": 18,
    "chapter": 119,
    "verse": 22,
    "text": "Remove from me reproach and contempt; for I have kept thy testimonies."
  },
  {
    "book": 19,
    "chapter": 3,
    "verse": 22,
    "text": "So shall they be life unto thy soul, and grace to thy neck."
  },
  {
    "book": 39,
    "chapter": 5,
    "verse": 22,
    "text": "But I say unto you, That whosoever is angry with his brother without a cause shall be in danger of the judgment: and whosoever shall say to his brother, Raca, shall be in danger of the council: but whosoever shall say, Thou fool, shall be in danger of hell fire."
  },
  {
    "book": 42,
    "chapter": 15,
    "verse": 22,
    "text": "If I had not come and spoken unto them, they had not had sin: but now they have no cloke for their sin."
  },
  {
    "book": 49,
    "chapter": 4,
    "verse": 22,
    "text": "All the saints salute you, chiefly they that are of Cesar’s household."
  },
  {
    "book": 19,
    "chapter": 4,
    "verse": 22,
    "text": "For they are life unto those that find them, and health to all their flesh."
  },
  {
    "book": 39,
    "chapter": 6,
    "verse": 22,
    "text": "The light of the body is the eye: if therefore thine eye be single, thy whole body shall be full of light."
  },
  {
    "book": 42,
    "chapter": 14,
    "verse": 22,
    "text": "Judas saith unto him, not Iscariot, Lord, how is it that thou wilt manifest thyself unto us, and not unto the world?"
  },
  {
    "book": 18,
    "chapter": 119,
    "verse": 23,
    "text": "Princes also did sit and speak against me: but thy servant did meditate in thy statutes."
  },
  {
    "book": 19,
    "chapter": 3,
    "verse": 23,
    "text": "Then shalt thou walk in thy way safely, and thy foot shall not stumble."
  },
  {
    "book": 39,
    "chapter": 5,
    "verse": 23,
    "text": "Therefore if thou bring thy gift to the altar, and there rememberest that thy brother hath ought against thee;"
  },
  {
    "book": 42,
    "chapter": 15,
    "verse": 23,
    "text": "He that hateth me hateth my Father also."
  },
  {
    "book": 49,
    "chapter": 4,
    "verse": 23,
    "text": "The grace of our Lord Jesus Christ be with you all. Amen. It was written to the Philippians from Rome by Epaphroditus."
  },
  {
    "book": 19,
    "chapter": 4,
    "verse": 23,
    "text": "Keep thy heart with all diligence; for out of it are the issues of life."
  },
  {
    "book": 39,
    "chapter": 6,
    "verse": 23,
    "text": "But if thine eye be evil, thy whole body shall be full of darkness. If therefore the light that is in thee be darkness, how great is that darkness!"
  },
  {
    "book": 42,
    "chapter": 14,
    "verse": 23,
    "text": "Jesus answered and said unto him, If a man love me, he will keep my words: and my Father will love him, and we will come unto him, and make our abode with him."
  },
  {
    "book": 18,
    "chapter": 119,
    "verse": 24,
    "text": "Thy testimonies also are my delight and my counsellors."
  },
  {
    "book": 19,
    "chapter": 3,
    "verse": 24,
    "text": "When thou liest down, thou shalt not be afraid: yea, thou shalt lie down, and thy sleep shall be sweet."
  },
  {
    "book": 39,
    "chapter": 5,
    "verse": 24,
    "text": "Leave there thy gift before the altar, and go thy way; first be reconciled to thy brother, and then come and offer thy gift."
  },
  {
    "book": 42,
    "chapter": 15,
    "verse": 24,
    "text": "If I had not done among them the works which none other man did, they had not had sin: but now have they both seen and hated both me and my Father."
  },
  {
    "book": 19,
    "chapter": 4,
    "verse": 24,
    "text": "Put away from thee a froward mouth, and perverse lips put far from thee."
  },
  {
    "book": 39,
    "chapter": 6,
    "verse": 24,
    "text": "No man can serve two masters: for either he will hate the one, and love the other; or else he will hold to the one, and despise the other. Ye cannot serve God and mammon."
  },
  {
    "book": 42,
    "chapter": 14,
    "verse": 24,
    "text": "He that loveth me not keepeth not my sayings: and the word which ye hear is not mine, but the Father’s which sent me."
  },
  {
    "book": 18,
    "chapter": 119,
    "verse": 25,
    "text": "ד DALETH. My soul cleaveth unto the dust: quicken thou me according to thy word."
  },
  {
    "book": 19,
    "chapter": 3,
    "verse": 25,
    "text": "Be not afraid of sudden fear, neither of the desolation of the wicked, when it cometh."
  },
  {
    "book": 39,
    "chapter": 5,
    "verse": 25,
    "text": "Agree with thine adversary quickly, whiles thou art in the way with him; lest at any time the adversary deliver thee to the judge, and the judge deliver thee to the officer, and thou be cast into prison."
  },
  {
    "book": 42,
    "chapter": 15,
    "verse": 25,
    "text": "But this cometh to pass, that the word might be fulfilled that is written in their law, They hated me without a cause."
  },
  {
    "book": 19,
    "chapter": 4,
    "verse": 25,
    "text": "Let thine eyes look right on, and let thine eyelids look straight before thee."
  },
  {
    "book": 39,
    "chapter": 6,
    "verse": 25,
    "text": "Therefore I say unto you, Take no thought for your life, what ye shall eat, or what ye shall drink; nor yet for your body, what ye shall put on. Is not the life more than meat, and the body than raiment?"
  },
  {
    "book": 42,
    "chapter": 14,
    "verse": 25,
    "text": "These things have I spoken unto you, being yet present with you."
  },
  {
    "book": 18,
    "chapter": 119,
    "verse": 26,
    "text": "I have declared my ways, and thou heardest me: teach me thy statutes."
  },
  {
    "book": 19,
    "chapter": 3,
    "verse": 26,
    "text": "For the Lord shall be thy confidence, and shall keep thy foot from being taken."
  },
  {
    "book": 39,
    "chapter": 5,
    "verse": 26,
    "text": "Verily I say unto thee, Thou shalt by no means come out thence, till thou hast paid the uttermost farthing."
  },
  {
    "book": 42,
    "chapter": 15,
    "verse": 26,
    "text": "But when the Comforter is come, whom I will send unto you from the Father, even the Spirit of truth, which proceedeth from the Father, he shall testify of me:"
  },
  {
    "book": 19,
    "chapter": 4,
    "verse": 26,
    "text": "Ponder the path of thy feet, and let all thy ways be established."
  },
  {
    "book": 39,
    "chapter": 6,
    "verse": 26,
    "text": "Behold the fowls of the air: for they sow not, neither do they reap, nor gather into barns; yet your heavenly Father feedeth them. Are ye not much better than they?"
  },
  {
    "book": 42,
    "chapter": 14,
    "verse": 26,
    "text": "But the Comforter, which is the Holy Ghost, whom the Father will send in my name, he shall teach you all things, and bring all things to your remembrance, whatsoever I have said unto you."
  },
  {
    "book": 18,
    "chapter": 119,
    "verse": 27,
    "text": "Make me to understand the way of thy precepts: so shall I talk of thy wondrous works."
  },
  {
    "book": 19,
    "chapter": 3,
    "verse": 27,
    "text": "Withhold not good from them to whom it is due, when it is in the power of thine hand to do it."
  },
  {
    "book": 39,
    "chapter": 5,
    "verse": 27,
    "text": "Ye have heard that it was said by them of old time, Thou shalt not commit adultery:"
  },
  {
    "book": 42,
    "chapter": 15,
    "verse": 27,
    "text": "And ye also shall bear witness, because ye have been with me from the beginning."
  },
  {
    "book": 19,
    "chapter": 4,
    "verse": 27,
    "text": "Turn not to the right hand nor to the left: remove thy foot from evil."
  },
  {
    "book": 39,
    "chapter": 6,
    "verse": 27,
    "text": "Which of you by taking thought can add one cubit unto his stature?"
  },
  {
    "book": 42,
    "chapter": 14,
    "verse": 27,
    "text": "Peace I leave with you, my peace I give unto you: not as the world giveth, give I unto you. Let not your heart be troubled, neither let it be afraid."
  },
  {
    "book": 18,
    "chapter": 119,
    "verse": 28,
    "text": "My soul melteth for heaviness: strengthen thou me according unto thy word."
  },
  {
    "book": 19,
    "chapter": 3,
    "verse": 28,
    "text": "Say not unto thy neighbour, Go, and come again, and to morrow I will give; when thou hast it by thee."
  },
  {
    "book": 39,
    "chapter": 5,
    "verse": 28,
    "text": "But I say unto you, That whosoever looketh on a woman to lust after her hath committed adultery with her already in his heart."
  },
  {
    "book": 39,
    "chapter": 6,
    "verse": 28,
    "text": "And why take ye thought for raiment? Consider the lilies of the field, how they grow; they toil not, neither do they spin:"
  },
  {
    "book": 42,
    "chapter": 14,
    "verse": 28,
    "text": "Ye have heard how I said unto you, I go away, and come again unto you. If ye loved me, ye would rejoice, because I said, I go unto the Father: for my Father is greater than I."
  },
  {
    "book": 18,
    "chapter": 119,
    "verse": 29,
    "text": "Remove from me the way of lying: and grant me thy law graciously."
  },
  {
    "book": 19,
    "chapter": 3,
    "verse": 29,
    "text": "Devise not evil against thy neighbour, seeing he dwelleth securely by thee."
  },
  {
    "book": 39,
    "chapter": 5,
    "verse": 29,
    "text": "And if thy right eye offend thee, pluck it out, and cast it from thee: for it is profitable for thee that one of thy members should perish, and not that thy whole body should be cast into hell."
  },
  {
    "book": 39,
    "chapter": 6,
    "verse": 29,
    "text": "And yet I say unto you, That even Solomon in all his glory was not arrayed like one of these."
  },
  {
    "book": 42,
    "chapter": 14,
    "verse": 29,
    "text": "And now I have told you before it come to pass, that, when it is come to pass, ye might believe."
  },
  {
    "book": 18,
    "chapter": 119,
    "verse": 30,
    "text": "I have chosen the way of truth: thy judgments have I laid before me."
  },
  {
    "book": 19,
    "chapter": 3,
    "verse": 30,
    "text": "Strive not with a man without cause, if he have done thee no harm."
  },
  {
    "book": 39,
    "chapter": 5,
    "verse": 30,
    "text": "And if thy right hand offend thee, cut it off, and cast it from thee: for it is profitable for thee that one of thy members should perish, and not that thy whole body should be cast into hell."
  },
  {
    "book": 39,
    "chapter": 6,
    "verse": 30,
    "text": "Wherefore, if God so clothe the grass of the field, which to day is, and to morrow is cast into the oven, shall he not much more clothe you, O ye of little faith?"
  },
  {
    "book": 42,
    "chapter": 14,
    "verse": 30,
    "text": "Hereafter I will not talk much with you: for the prince of this world cometh, and hath nothing in me."
  },
  {
    "book": 18,
    "chapter": 119,
    "verse": 31,
    "text": "I have stuck unto thy testimonies: O Lord, put me not to shame."
  },
  {
    "book": 19,
    "chapter": 3,
    "verse": 31,
    "text": "Envy thou not the oppressor, and choose none of his ways."
  },
  {
    "book": 39,
    "chapter": 5,
    "verse": 31,
    "text": "It hath been said, Whosoever shall put away his wife, let him give her a writing of divorcement:"
  },
  {
    "book": 39,
    "chapter": 6,
    "verse": 31,
    "text": "Therefore take no thought, saying, What shall we eat? or, What shall we drink? or, Wherewithal shall we be clothed?"
  },
  {
    "book": 42,
    "chapter": 14,
    "verse": 31,
    "text": "But that the world may know that I love the Father; and as the Father gave me commandment, even so I do. Arise, let us go hence."
  },
  {
    "book": 18,
    "chapter": 119,
    "verse": 32,
    "text": "I will run the way of thy commandments, when thou shalt enlarge my heart."
  },
  {
    "book": 19,
    "chapter": 3,
    "verse": 32,
    "text": "For the froward is abomination to the Lord: but his secret is with the righteous."
  },
  {
    "book": 39,
    "chapter": 5,
    "verse": 32,
    "text": "But I say unto you, That whosoever shall put away his wife, saving for the cause of fornication, causeth her to commit adultery: and whosoever shall marry her that is divorced committeth adultery."
  },
  {
    "book": 39,
    "chapter": 6,
    "verse": 32,
    "text": "(For after all these things do the Gentiles seek:) for your heavenly Father knoweth that ye have need of all these things."
  },
  {
    "book": 18,
    "chapter": 119,
    "verse": 33,
    "text": "ה HE. Teach me, O Lord, the way of thy statutes; and I shall keep it unto the end."
  },
  {
    "book": 19,
    "chapter": 3,
    "verse": 33,
    "text": "The curse of the Lord is in the house of the wicked: but he blesseth the habitation of the just."
  },
  {
    "book": 39,
    "chapter": 5,
    "verse": 33,
    "text": "Again, ye have heard that it hath been said by them of old time, Thou shalt not forswear thyself, but shalt perform unto the Lord thine oaths:"
  },
  {
    "book": 39,
    "chapter": 6,
    "verse": 33,
    "text": "But seek ye first the kingdom of God, and his righteousness; and all these things shall be added unto you."
  },
  {
    "book": 18,
    "chapter": 119,
    "verse": 34,
    "text": "Give me understanding, and I shall keep thy law; yea, I shall observe it with my whole heart."
  },
  {
    "book": 19,
    "chapter": 3,
    "verse": 34,
    "text": "Surely he scorneth the scorners: but he giveth grace unto the lowly."
  },
  {
    "book": 39,
    "chapter": 5,
    "verse": 34,
    "text": "But I say unto you, Swear not at all; neither by heaven; for it is God’s throne:"
  },
  {
    "book": 39,
    "chapter": 6,
    "verse": 34,
    "text": "Take therefore no thought for the morrow: for the morrow shall take thought for the things of itself. Sufficient unto the day is the evil thereof."
  },
  {
    "book": 18,
    "chapter": 119,
    "verse": 35,
    "text": "Make me to go in the path of thy commandments; for therein do I delight."
  },
  {
    "book": 19,
    "chapter": 3,
    "verse": 35,
    "text": "The wise shall inherit glory: but shame shall be the promotion of fools."
  },
  {
    "book": 39,
    "chapter": 5,
    "verse": 35,
    "text": "Nor by the earth; for it is his footstool: neither by Jerusalem; for it is the city of the great King."
  },
  {
    "book": 18,
    "chapter": 119,
    "verse": 36,
    "text": "Incline my heart unto thy testimonies, and not to covetousness."
  },
  {
    "book": 39,
    "chapter": 5,
    "verse": 36,
    "text": "Neither shalt thou swear by thy head, because thou canst not make one hair white or black."
  },
  {
    "book": 18,
    "chapter": 119,
    "verse": 37,
    "text": "Turn away mine eyes from beholding vanity; and quicken thou me in thy way."
  },
  {
    "book": 39,
    "chapter": 5,
    "verse": 37,
    "text": "But let your communication be, Yea, yea; Nay, nay: for whatsoever is more than these cometh of evil."
  },
  {
    "book": 18,
    "chapter": 119,
    "verse": 38,
    "text": "Stablish thy word unto thy servant, who is devoted to thy fear."
  },
  {
    "book": 39,
    "chapter": 5,
    "verse": 38,
    "text": "Ye have heard that it hath been said, An eye for an eye, and a tooth for a tooth:"
  },
  {
    "book": 18,
    "chapter": 119,
    "verse": 39,
    "text": "Turn away my reproach which I fear: for thy judgments are good."
  },
  {
    "book": 39,
    "chapter": 5,
    "verse": 39,
    "text": "But I say unto you, That ye resist not evil: but whosoever shall smite thee on thy right cheek, turn to him the other also."
  },
  {
    "book": 18,
    "chapter": 119,
    "verse": 40,
    "text": "Behold, I have longed after thy precepts: quicken me in thy righteousness."
  },
  {
    "book": 39,
    "chapter": 5,
    "verse": 40,
    "text": "And if any man will sue thee at the law, and take away thy coat, let him have thy cloke also."
  },
  {
    "book": 18,
    "chapter": 119,
    "verse": 41,
    "text": "ו VAU. Let thy mercies come also unto me, O Lord, even thy salvation, according to thy word."
  },
  {
    "book": 39,
    "chapter": 5,
    "verse": 41,
    "text": "And whosoever shall compel thee to go a mile, go with him twain."
  },
  {
    "book": 18,
    "chapter": 119,
    "verse": 42,
    "text": "So shall I have wherewith to answer him that reproacheth me: for I trust in thy word."
  },
  {
    "book": 39,
    "chapter": 5,
    "verse": 42,
    "text": "Give to him that asketh thee, and from him that would borrow of thee turn not thou away."
  },
  {
    "book": 18,
    "chapter": 119,
    "verse": 43,
    "text": "And take not the word of truth utterly out of my mouth; for I have hoped in thy judgments."
  },
  {
    "book": 39,
    "chapter": 5,
    "verse": 43,
    "text": "Ye have heard that it hath been said, Thou shalt love thy neighbour, and hate thine enemy."
  },
  {
    "book": 18,
    "chapter": 119,
    "verse": 44,
    "text": "So shall I keep thy law continually for ever and ever."
  },
  {
    "book": 39,
    "chapter": 5,
    "verse": 44,
    "text": "But I say unto you, Love your enemies, bless them that curse you, do good to them that hate you, and pray for them which despitefully use you, and persecute you;"
  },
  {
    "book": 18,
    "chapter": 119,
    "verse": 45,
    "text": "And I will walk at liberty: for I seek thy precepts."
  },
  {
    "book": 39,
    "chapter": 5,
    "verse": 45,
    "text": "That ye may be the children of your Father which is in heaven: for he maketh his sun to rise on the evil and on the good, and sendeth rain on the just and on the unjust."
  },
  {
    "book": 18,
    "chapter": 119,
    "verse": 46,
    "text": "I will speak of thy testimonies also before kings, and will not be ashamed."
  },
  {
    "book": 39,
    "chapter": 5,
    "verse": 46,
    "text": "For if ye love them which love you, what reward have ye? do not even the publicans the same?"
  },
  {
    "book": 18,
    "chapter": 119,
    "verse": 47,
    "text": "And I will delight myself in thy commandments, which I have loved."
  },
  {
    "book": 39,
    "chapter": 5,
    "verse": 47,
    "text": "And if ye salute your brethren only, what do ye more than others? do not even the publicans so?"
  },
  {
    "book": 18,
    "chapter": 119,
    "verse": 48,
    "text": "My hands also will I lift up unto thy commandments, which I have loved; and I will meditate in thy statutes."
  },
  {
    "book": 39,
    "chapter": 5,
    "verse": 48,
    "text": "Be ye therefore perfect, even as your Father which is in heaven is perfect."
  },
  {
    "book": 18,
    "chapter": 119,
    "verse": 49,
    "text": "ז ZAIN. Remember the word unto thy servant, upon which thou hast caused me to hope."
  },
  {
    "book": 18,
    "chapter": 119,
    "verse": 50,
    "text": "This is my comfort in my affliction: for thy word hath quickened me."
  },
  {
    "book": 18,
    "chapter": 119,
    "verse": 51,
    "text": "The proud have had me greatly in derision: yet have I not declined from thy law."
  },
  {
    "book": 18,
    "chapter": 119,
    "verse": 52,
    "text": "I remembered thy judgments of old, O Lord; and have comforted myself."
  },
  {
    "book": 18,
    "chapter": 119,
    "verse": 53,
    "text": "Horror hath taken hold upon me because of the wicked that forsake thy law."
  },
  {
    "book": 18,
    "chapter": 119,
    "verse": 54,
    "text": "Thy statutes have been my songs in the house of my pilgrimage."
  },
  {
    "book": 18,
    "chapter": 119,
    "verse": 55,
    "text": "I have remembered thy name, O Lord, in the night, and have kept thy law."
  },
  {
    "book": 18,
    "chapter": 119,
    "verse": 56,
    "text": "This I had, because I kept thy precepts."
  },
  {
    "book": 18,
    "chapter": 119,
    "verse": 57,
    "text": "ח CHETH. Thou art my portion, O Lord: I have said that I would keep thy words."
  },
  {
    "book": 18,
    "chapter": 119,
    "verse": 58,
    "text": "I intreated thy favour with my whole heart: be merciful unto me according to thy word."
  },
  {
    "book": 18,
    "chapter": 119,
    "verse": 59,
    "text": "I thought on my ways, and turned my feet unto thy testimonies."
  },
  {
    "book": 18,
    "chapter": 119,
    "verse": 60,
    "text": "I made haste, and delayed not to keep thy commandments."
  },
  {
    "book": 18,
    "chapter": 119,
    "verse": 61,
    "text": "The bands of the wicked have robbed me: but I have not forgotten thy law."
  },
  {
    "book": 18,
    "chapter": 119,
    "verse": 62,
    "text": "At midnight I will rise to give thanks unto thee because of thy righteous judgments."
  },
  {
    "book": 18,
    "chapter": 119,
    "verse": 63,
    "text": "I am a companion of all them that fear thee, and of them that keep thy precepts."
  },
  {
    "book": 18,
    "chapter": 119,
    "verse": 64,
    "text": "The earth, O Lord, is full of thy mercy: teach me thy statutes."
  },
  {
    "book": 18,
    "chapter": 119,
    "verse": 65,
    "text": "ט TETH. Thou hast dealt well with thy servant, O Lord, according unto thy word."
  },
  {
    "book": 18,
    "chapter": 119,
    "verse": 66,
    "text": "Teach me good judgment and knowledge: for I have believed thy commandments."
  },
  {
    "book": 18,
    "chapter": 119,
    "verse": 67,
    "text": "Before I was afflicted I went astray: but now have I kept thy word."
  },
  {
    "book": 18,
    "chapter": 119,
    "verse": 68,
    "text": "Thou art good, and doest good; teach me thy statutes."
  },
  {
    "book": 18,
    "chapter": 119,
    "verse": 69,
    "text": "The proud have forged a lie against me: but I will keep thy precepts with my whole heart."
  },
  {
    "book": 18,
    "chapter": 119,
    "verse": 70,
    "text": "Their heart is as fat as grease; but I delight in thy law."
  },
  {
    "book": 18,
    "chapter": 119,
    "verse": 71,
    "text": "It is good for me that I have been afflicted; that I might learn thy statutes."
  },
  {
    "book": 18,
    "chapter": 119,
    "verse": 72,
    "text": "The law of thy mouth is better unto me than thousands of gold and silver."
  },
  {
    "book": 18,
    "chapter": 119,
    "verse": 73,
    "text": "י JOD. Thy hands have made me and fashioned me: give me understanding, that I may learn thy commandments."
  },
  {
    "book": 18,
    "chapter": 119,
    "verse": 74,
    "text": "They that fear thee will be glad when they see me; because I have hoped in thy word."
  },
  {
    "book": 18,
    "chapter": 119,
    "verse": 75,
    "text": "I know, O Lord, that thy judgments are right, and that thou in faithfulness hast afflicted me."
  },
  {
    "book": 18,
    "chapter": 119,
    "verse": 76,
    "text": "Let, I pray thee, thy merciful kindness be for my comfort, according to thy word unto thy servant."
  }
];
const VALID_PROGRESS_KEYS = new Set(
  allBooks.flatMap((book) => Array.from({ length: book.chapters }, (_, index) => `${book.name}-${index + 1}`)),
);

function readSaved() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return new Set(Array.isArray(saved) ? saved.filter((key) => VALID_PROGRESS_KEYS.has(key)) : []);
  } catch {
    return new Set();
  }
}

function readSavedDates() {
  try {
    const saved = JSON.parse(localStorage.getItem(DATES_KEY) || '{}');
    return saved && typeof saved === 'object' && !Array.isArray(saved) ? saved : {};
  } catch { return {}; }
}

function readStoredNumber(key) {
  const value = Number(localStorage.getItem(key));
  return Number.isInteger(value) && value >= 0 ? value : 0;
}

function readStoredBoolean(key) {
  return localStorage.getItem(key) === 'true';
}

function readSavedHistory() {
  try {
    const saved = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
    return Array.isArray(saved) ? saved.filter((entry) => entry && Number.isInteger(entry.round) && entry.round > 0 && typeof entry.chapter === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(entry.date)) : [];
  } catch { return []; }
}

function localDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatDate(dateKey) {
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' }).format(new Date(year, month - 1, day));
}

function DailyVerse() {
  const [todayKey, setTodayKey] = useState(localDateKey);
  useEffect(() => { const tick = () => setTodayKey(localDateKey()); const timer = setInterval(tick, 30000); window.addEventListener('focus', tick); return () => { clearInterval(timer); window.removeEventListener('focus', tick); }; }, []);
  const [year, month, day] = todayKey.split('-').map(Number);
  const dayNumber = Math.floor((Date.UTC(year, month - 1, day) - Date.UTC(year, 0, 1)) / 86400000);
  const verse = DAILY_VERSES[dayNumber % DAILY_VERSES.length];
  return <section className="daily-verse" aria-labelledby="daily-verse-title">
    <div className="daily-verse-label"><Sparkles /><div><p>{formatDate(todayKey)}</p><h2 id="daily-verse-title">Today’s Word</h2></div></div>
    <blockquote>“{verse.text}”</blockquote>
    <cite>{allBooks[verse.book].name} {verse.chapter}:{verse.verse}</cite><p className="source-note">King James Version (KJV) · <a href="https://github.com/scrollmapper/bible_databases" target="_blank" rel="noreferrer">Text source</a> · 365 passages (leap day 366 repeats the first)</p>
  </section>;
}

function ReadingJourney({ completedRounds, currentRound, isComplete, onStartNext }) {
  return <section className={isComplete ? 'reading-journey complete' : 'reading-journey'} aria-labelledby="journey-title">
    <div className="journey-heading"><span><Trophy /></span><div><p>My Bible Reading Journey</p><h2 id="journey-title">{isComplete ? `Round ${completedRounds} Complete!` : `Reading Round ${currentRound}`}</h2></div></div>
    <div className="round-badges" aria-label={`${completedRounds} completed Bible readings`}>
      {completedRounds > 0 ? Array.from({ length: completedRounds }, (_, index) => <span key={index + 1}><CheckCircle2 /> Round {index + 1} Complete</span>) : <span className="round-pending">Walking with God’s Word toward your first complete reading.</span>}
    </div>
    <p className="journey-message">{isComplete ? `Congratulations! You have read all ${TOTAL_CHAPTERS.toLocaleString()} chapters of the Bible.` : `Every chapter is a meaningful step toward completing reading round ${currentRound}.`}</p>
    {isComplete && <button type="button" className="next-round" onClick={onStartNext}><BookOpen /> Start Round {completedRounds + 1}</button>}
  </section>;
}


function Header() {
  return <header className="site-header">
    <img src={`${BASE_URL}church-logo.jpg`} alt="Korean Church of Westchester" />
    <span>Family Bible Reading</span>
  </header>;
}

function ProgressRing({ completed }) {
  const percent = Math.round((completed / TOTAL_CHAPTERS) * 100);
  return <div className="progress-ring" style={{ '--progress': `${percent * 3.6}deg` }} aria-label={`Overall progress: ${percent}%`}>
    <div className="progress-inner"><small>Overall Progress</small><strong>{percent}<em>%</em></strong><span>{completed.toLocaleString()} / {TOTAL_CHAPTERS.toLocaleString()} chapters</span></div>
  </div>;
}

function BookRow({ book, done, onSelect }) {
  const percent = Math.round((done / book.chapters) * 100);
  const isComplete = done === book.chapters;
  return <button type="button" className="book-row" onClick={onSelect}>
    <span className={isComplete ? 'book-status complete' : 'book-status'}>{isComplete ? <CheckCircle2 /> : <Circle />}</span>
    <div className="book-row-copy"><strong>{book.name}</strong><span>{isComplete ? 'Reading complete' : `${done} of ${book.chapters} chapters read`}</span></div>
    <div className="mini-track"><span style={{ width: `${percent}%` }} /></div>
    <ChevronRight size={20} aria-hidden="true" />
  </button>;
}

function ChapterGrid({ book, completed, toggleChapter, toggleBook }) {
  const done = Array.from({ length: book.chapters }, (_, i) => i + 1).filter((chapter) => completed.has(`${book.name}-${chapter}`)).length;
  const isComplete = done === book.chapters;
  return <section className="chapter-section" aria-labelledby="book-title">
    <div className="section-heading"><div><BookOpen size={27} /><h2 id="book-title">{book.name}</h2></div><span><b>{done}</b> / {book.chapters} complete</span></div>
    <div className="book-progress"><span style={{ width: `${(done / book.chapters) * 100}%` }} /></div>
    <button type="button" className={isComplete ? 'complete-book active' : 'complete-book'} onClick={() => toggleBook(book)} aria-pressed={isComplete}>
      {isComplete ? <CheckCircle2 /> : <Circle />}
      <span>{isComplete ? `${book.name} reading complete` : `Mark all of ${book.name} complete`}</span>
    </button>
    <p className="chapter-help">Tap a chapter number once to mark it complete. Tap it again to undo.</p>
    <div className="chapter-grid">
      {Array.from({ length: book.chapters }, (_, i) => i + 1).map((chapter) => {
        const checked = completed.has(`${book.name}-${chapter}`);
        return <button type="button" key={chapter} className={checked ? 'chapter done' : 'chapter'} aria-label={`${book.name} chapter ${chapter}${checked ? ', completed' : ''}`} aria-pressed={checked} onClick={() => toggleChapter(book.name, chapter)}>
          {checked ? <><Check size={16} />{chapter}</> : chapter}
        </button>;
      })}
    </div>
  </section>;
}

function Vision() {
  return <section className="vision-panel">
    <Heart size={34} strokeWidth={1.7} />
    <p>Our Church Vision</p>
    <h2>A Church That Shares the Gospel</h2>
    <div className="gold-rule"><span /></div>
    <blockquote>“We desire to love God more<br />and know Him more.”</blockquote>
    <div className="world-vision">
      <span>Worship</span><span>Small Groups</span><span>Service</span><span>Evangelism</span><span>Discipleship</span>
    </div>
  </section>;
}

function ReadingCalendar({ readingEntries, onRecord, journalEntries, onJournal }) {
  const todayKey = localDateKey();
  const today = new Date();
  const [monthDate, setMonthDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState(todayKey);
  const readingsByDate = useMemo(() => {
    const grouped = {};
    readingEntries.forEach(({ chapter, date, round }) => {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return;
      (grouped[date] ||= []).push({ chapter, round });
    });
    Object.values(grouped).forEach((items) => items.sort((a, b) => a.round - b.round || a.chapter.localeCompare(b.chapter, 'en')));
    return grouped;
  }, [readingEntries]);

  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];
  while (cells.length % 7) cells.push(null);
  const selectedReadings = readingsByDate[selectedDate] || [];
  const [editBook, setEditBook] = useState(0);
  const [editChapter, setEditChapter] = useState(1);
  const [recordMessage, setRecordMessage] = useState('');
  const moveMonth = (amount) => {
    const nextMonth = new Date(year, month + amount, 1);
    setMonthDate(nextMonth);
    setSelectedDate(localDateKey(nextMonth));
  };
  const returnToToday = () => {
    setMonthDate(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelectedDate(todayKey);
  };

  return <section className="calendar-panel" aria-labelledby="calendar-title">
    <div className="calendar-heading">
      <div><CalendarDays /><div><p>Reading by Date</p><h2 id="calendar-title">Reading Calendar</h2></div></div>
      <button type="button" onClick={returnToToday}>Today</button>
    </div>
    <div className="calendar-month-nav">
      <button type="button" onClick={() => moveMonth(-1)} aria-label="Previous month"><ChevronLeft /></button>
      <strong>{new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(monthDate)}</strong>
      <button type="button" onClick={() => moveMonth(1)} aria-label="Next month"><ChevronRight /></button>
    </div>
    <div className="calendar-weekdays" aria-hidden="true">
      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => <span key={day}>{day}</span>)}
    </div>
    <div className="calendar-grid">
      {cells.map((day, index) => {
        if (!day) return <span className="calendar-empty" key={`empty-${index}`} />;
        const dateKey = localDateKey(new Date(year, month, day));
        const count = readingsByDate[dateKey]?.length || 0;
        const hasJournal = Boolean(journalEntries[dateKey]);
        const className = ['calendar-day', dateKey === todayKey ? 'today' : '', dateKey === selectedDate ? 'selected' : '', count ? 'has-reading' : ''].filter(Boolean).join(' ');
        const countLabel = `${count} ${count === 1 ? 'chapter' : 'chapters'} read`;
        return <button type="button" key={dateKey} className={className} onClick={() => setSelectedDate(dateKey)} aria-label={`${formatDate(dateKey)}, ${countLabel}${hasJournal ? ", notes or gratitude recorded" : ""}`}>
          <span>{day}</span>{hasJournal && <span className="calendar-journal-marker" aria-hidden="true">✎</span>}{count > 0 && <b>{count} ch.</b>}
        </button>;
      })}
    </div>
    <div className="calendar-detail" aria-live="polite">
      <div><span>{formatDate(selectedDate)}</span><strong>{selectedReadings.length} {selectedReadings.length === 1 ? 'chapter' : 'chapters'} read</strong></div>
      {selectedReadings.length ? <ul>{selectedReadings.map(({ chapter, round }) => {
        const splitAt = chapter.lastIndexOf('-');
        return <li key={`${round}-${chapter}`}><CheckCircle2 /> <b>Round {round}</b> · {chapter.slice(0, splitAt)} {chapter.slice(splitAt + 1)}</li>;
      })}</ul> : <p>No Bible reading is recorded for this date.</p>}
    </div>
    <CalendarJournalButton language="en" date={selectedDate} onOpen={onJournal} />
    <form className="record-editor" onSubmit={(event) => { event.preventDefault(); onRecord(allBooks[editBook].name + '-' + editChapter, selectedDate); setRecordMessage('Saved to the selected date.'); }}><h3>Record reading on this date</h3><p>Add or move a chapter in your current reading round.</p><label>Book<select value={editBook} onChange={e=>{setEditBook(Number(e.target.value));setEditChapter(1);}}>{allBooks.map((b,i)=><option key={b.name} value={i}>{b.name}</option>)}</select></label><label>Chapter<select value={editChapter} onChange={e=>setEditChapter(Number(e.target.value))}>{Array.from({length:allBooks[editBook].chapters},(_,i)=><option key={i+1} value={i+1}>{i+1}</option>)}</select></label><button disabled={selectedDate>todayKey}>Save to this date</button><p role="status">{recordMessage}</p></form>
    <p className="calendar-note">Date-by-date records from completed rounds stay in your history. Existing progress is preserved; older chapters without dates cannot appear on the calendar.</p>
  </section>;
}

function App() {
  const journal = useJournal(JOURNAL_KEY);
  const [journalDate, setJournalDate] = useState(localDateKey);
  const openJournal = date => { setJournalDate(date); setTab('journal'); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const [completed, setCompleted] = useState(readSaved);
  const [readingDates, setReadingDates] = useState(readSavedDates);
  const [completedRounds, setCompletedRounds] = useState(() => readStoredNumber(ROUNDS_KEY));
  const [roundAwarded, setRoundAwarded] = useState(() => readStoredBoolean(ROUND_AWARDED_KEY));
  const [readingHistory, setReadingHistory] = useState(readSavedHistory);
  const [selectedBook, setSelectedBook] = useState(allBooks[0]);
  const [testament, setTestament] = useState('old');
  const [tab, setTab] = useState('home');
  const [showBookDetail, setShowBookDetail] = useState(false);

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify([...completed])); }, [completed]);
  useEffect(() => { localStorage.setItem(DATES_KEY, JSON.stringify(readingDates)); }, [readingDates]);
  useEffect(() => { localStorage.setItem(ROUNDS_KEY, String(completedRounds)); }, [completedRounds]);
  useEffect(() => { localStorage.setItem(ROUND_AWARDED_KEY, String(roundAwarded)); }, [roundAwarded]);
  useEffect(() => { localStorage.setItem(HISTORY_KEY, JSON.stringify(readingHistory)); }, [readingHistory]);
  useEffect(() => { if ('serviceWorker' in navigator) navigator.serviceWorker.register(`${BASE_URL}sw.js`); }, []);
  useEffect(() => {
    if (completed.size === TOTAL_CHAPTERS && !roundAwarded) {
      setCompletedRounds(completedRounds + 1);
      setRoundAwarded(true);
    }
  }, [completed.size, completedRounds, roundAwarded]);

  const doneByBook = useMemo(() => {
    const map = new Map();
    allBooks.forEach((book) => map.set(book.name, Array.from(completed).filter((key) => key.startsWith(`${book.name}-`)).length));
    return map;
  }, [completed]);

  const visibleBooks = testament === 'old' ? allBooks.slice(0, 39) : allBooks.slice(39);
  const toggleChapter = (name, chapter) => {
    const key = `${name}-${chapter}`;
    const willComplete = !completed.has(key);
    setCompleted((current) => {
      const next = new Set(current);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
    setReadingDates((current) => {
      const next = { ...current };
      if (willComplete) next[key] = localDateKey(); else delete next[key];
      return next;
    });
  };
  const toggleBook = (book) => {
    const keys = Array.from({ length: book.chapters }, (_, index) => `${book.name}-${index + 1}`);
    const isComplete = keys.every((key) => completed.has(key));
    const today = localDateKey();
    setCompleted((current) => {
    const next = new Set(current);
    keys.forEach((key) => { if (isComplete) next.delete(key); else next.add(key); });
    return next;
    });
    setReadingDates((current) => {
      const next = { ...current };
      keys.forEach((key) => { if (isComplete) delete next[key]; else if (!completed.has(key)) next[key] = today; });
      return next;
    });
  };
  const openBook = (book) => {
    setSelectedBook(book);
    setTestament(book.testament);
    setShowBookDetail(true);
    setTab('bible');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const openBookList = (nextTestament = testament) => {
    setTestament(nextTestament);
    setShowBookDetail(false);
    setTab('bible');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const isRoundComplete = completed.size === TOTAL_CHAPTERS;
  const visibleCompletedRounds = completedRounds + (isRoundComplete && !roundAwarded ? 1 : 0);
  const currentRound = isRoundComplete ? visibleCompletedRounds : completedRounds + (roundAwarded ? 0 : 1);
  const readingEntries = useMemo(() => [
    ...readingHistory,
    ...Object.entries(readingDates).filter(([chapter]) => completed.has(chapter)).map(([chapter, date]) => ({ round: currentRound, chapter, date })),
  ], [completed, currentRound, readingDates, readingHistory]);
  const startNextRound = () => {
    const finishedRound = visibleCompletedRounds;
    const archivedEntries = Object.entries(readingDates).map(([chapter, date]) => ({ round: finishedRound, chapter, date }));
    setReadingHistory((history) => [...history.filter((entry) => entry.round !== finishedRound), ...archivedEntries]);
    setCompletedRounds(finishedRound);
    setRoundAwarded(false);
    setCompleted(new Set());
    setReadingDates({});
    setSelectedBook(allBooks[0]);
    setShowBookDetail(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const nextUnread = allBooks.find((book) => (doneByBook.get(book.name) || 0) < book.chapters) || allBooks[0];
  const todayCount = readingEntries.filter(({ date }) => date === localDateKey()).length;

  return <div className="app-shell">
    <Header />
    <Preferences language="en" keys={BACKUP_KEYS} journalKey={JOURNAL_KEY} journal={journal} allBooks={allBooks} />
    <main>
      {tab === 'home' && <>
        <section className="welcome"><Sunrise /><div><p>May God</p><h1>Bless you and be with you today!</h1><span>Family Bible Reading 2026–2027</span></div></section>
        <DailyVerse />
        <JournalShortcut language="en" onOpen={openJournal} />
        <section className="dashboard">
          <ProgressRing completed={completed.size} />
          <div className="today-area"><div className="today-count"><small>Read Today</small><strong>{todayCount}<em> chapters</em></strong></div><button type="button" onClick={() => openBook(nextUnread)}><BookOpen /> Continue Reading</button><button type="button" className="calendar-shortcut" onClick={() => { setTab('calendar'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}><CalendarDays /> View Reading Calendar</button><p>Continue your journey through {nextUnread.name}.</p></div>
        </section>
        <ReadingJourney completedRounds={visibleCompletedRounds} currentRound={currentRound} isComplete={isRoundComplete} onStartNext={startNextRound} />
        <div className="testament-links">
          <button type="button" onClick={() => openBookList('old')}><span className="round-icon blue"><BookOpen /></span><div><strong>Old Testament</strong><small>Genesis – Malachi</small></div><ChevronRight /></button>
          <button type="button" onClick={() => openBookList('new')}><span className="round-icon gold"><BookOpen /></span><div><strong>New Testament</strong><small>Matthew – Revelation</small></div><ChevronRight /></button>
        </div>
        <ChapterGrid book={selectedBook} completed={completed} toggleChapter={toggleChapter} toggleBook={toggleBook} />
        <Vision />
      </>}
      {tab === 'bible' && <section className="bible-view">
        {showBookDetail ? <>
          <button type="button" className="back-to-books" onClick={() => setShowBookDetail(false)}><ArrowLeft /> All Books</button>
          <ChapterGrid book={selectedBook} completed={completed} toggleChapter={toggleChapter} toggleBook={toggleBook} />
        </> : <>
          <div className="page-title"><h1>Choose a Book</h1><p>Select a book to view its chapters.</p></div>
          <div className="segment"><button type="button" className={testament === 'old' ? 'active' : ''} onClick={() => setTestament('old')}>Old Testament · 39</button><button type="button" className={testament === 'new' ? 'active' : ''} onClick={() => setTestament('new')}>New Testament · 27</button></div>
          <div className="book-list">{visibleBooks.map((book) => <BookRow key={book.name} book={book} done={doneByBook.get(book.name) || 0} onSelect={() => openBook(book)} />)}</div>
        </>}
      </section>}
      {tab === 'calendar' && <div className="calendar-page"><div className="page-title"><h1>My Reading History</h1><p>See what you read today and review your progress by date.</p></div><ReadingCalendar journalEntries={journal.entries} onJournal={openJournal} readingEntries={readingEntries} onRecord={(chapter,date)=>{setCompleted(current=>new Set([...current,chapter]));setReadingDates(current=>({...current,[chapter]:date}));}} /></div>}
      {tab === 'journal' && <Journal language="en" journal={journal} date={journalDate} onDateChange={setJournalDate} />}
      {tab === 'vision' && <div className="vision-page"><div className="page-title"><h1>Our Vision</h1><p>We read God’s Word and share the Gospel through our lives.</p></div><Vision /><section className="prayer"><h2>Our Hope and Prayer</h2><ol><li>We desire to love God more and know Him more.</li><li>We desire to love and serve our neighbors in New York and Westchester.</li><li>We look forward to the new revival God will bring to the Korean Church of Westchester.</li></ol></section><button type="button" className="reset" onClick={() => { if (confirm('Reset all progress, completed rounds, and reading history?')) { setCompleted(new Set()); setReadingDates({}); setReadingHistory([]); setCompletedRounds(0); setRoundAwarded(false); } }}><RotateCcw size={17} /> Reset Reading Progress</button></div>}
    </main>
    <nav className="bottom-nav" aria-label="Main navigation">
      {[["home","Home",Home],["bible","Bible",BookOpen],["calendar","Calendar",CalendarDays],["journal","Journal",NotebookPen],["vision","Vision",Heart]].map(([key,label,Icon]) => <button type="button" key={key} className={tab === key ? 'active' : ''} onClick={() => { if (key === 'bible') setShowBookDetail(false); setTab(key); window.scrollTo({ top: 0, behavior: 'smooth' }); }}><Icon /><span>{label}</span></button>)}
    </nav>
  </div>;
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);
