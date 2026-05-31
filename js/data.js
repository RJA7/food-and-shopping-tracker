'use strict';

// Sedentary ×1.2 | Boy 173cm ~70kg → 2050 kcal | Girl 163cm ~57kg → 1650 kcal | Combined 3700 kcal
// Meals ~3250 kcal; rest from drinks/snacks.  All weights RAW/UNCOOKED unless ml or pc.
// Eggs always in pieces (1 large egg ≈ 55 g ≈ 75 kcal).
//
// ── Leftover / batch-cook system ────────────────────────────────────────────
// isLeftover:true  → reheating previous cook; no ingredients, no shopping.
// servings:2       → ingredient amounts are for FULL BATCH (2 portions);
//                    kcal shown is per portion.  Save half for the next day.

const NUTRITION = {
  boy:      { height: 173, weight: 70, tdee: 2050 },
  girl:     { height: 163, weight: 57, tdee: 1650 },
  combined: 3700,
};

const CATEGORIES = {
  'meat':       { labelKey: 'cat_meat',    icon: '🥩', order: 1 },
  'fish':       { labelKey: 'cat_fish',    icon: '🐟', order: 2 },
  'dairy-eggs': { labelKey: 'cat_dairy',   icon: '🥚', order: 3 },
  'produce':    { labelKey: 'cat_produce', icon: '🥦', order: 4 },
  'grains':     { labelKey: 'cat_grains',  icon: '🌾', order: 5 },
  'pantry':     { labelKey: 'cat_pantry',  icon: '🫙', order: 6 },
};

// ════════════════════════════════════════════════════════════════════════════
//  WEEK 1  (Days 0–6)
// ════════════════════════════════════════════════════════════════════════════
const MEAL_PLAN = [

  // ── Day 0 · Monday W1 ─────────────────────────────────────────────────
  {
    dayName:   { en: 'Monday',    uk: 'Понеділок' },
    shortName: { en: 'Mon',       uk: 'Пн'        },
    week: 1,
    breakfast: {
      name: { en: 'Oatmeal with Eggs & Banana', uk: 'Вівсянка з яйцями та бананом' },
      kcal: 939,
      ingredients: [
        { name: { en: 'Rolled oats', uk: 'Вівсяні пластівці' }, amount: 150, unit: 'g',  category: 'grains'     },
        { name: { en: 'Eggs',        uk: 'Яйця'              }, amount: 2,   unit: 'pc', category: 'dairy-eggs' },
        { name: { en: 'Banana',      uk: 'Банан'             }, amount: 150, unit: 'g',  category: 'produce'    },
        { name: { en: 'Whole milk',  uk: 'Молоко'            }, amount: 60,  unit: 'ml', category: 'dairy-eggs' },
        { name: { en: 'Honey',       uk: 'Мед'               }, amount: 15,  unit: 'g',  category: 'pantry'     },
      ],
    },
    lunch: {
      // Chicken breast → shared with Wed W1 lunch (600 g total)
      name: { en: 'Chicken Rice Bowl', uk: 'Рис з куркою та овочами' },
      kcal: 1313,
      ingredients: [
        { name: { en: 'Chicken breast', uk: 'Куряче філе'    }, amount: 320, unit: 'g',  category: 'meat'    },
        { name: { en: 'White rice',     uk: 'Білий рис'      }, amount: 220, unit: 'g',  category: 'grains'  },
        { name: { en: 'Broccoli',       uk: 'Броколі'        }, amount: 160, unit: 'g',  category: 'produce' },
        { name: { en: 'Carrot',         uk: 'Морква'         }, amount: 80,  unit: 'g',  category: 'produce' },
        { name: { en: 'Olive oil',      uk: 'Оливкова олія'  }, amount: 12,  unit: 'ml', category: 'pantry'  },
        { name: { en: 'Garlic',         uk: 'Часник'         }, amount: 8,   unit: 'g',  category: 'produce' },
      ],
    },
    dinner: {
      // Salmon → shared with Fri W1 dinner (600 g total)
      // Baby spinach → shared with Tue W1 lunch + Fri W1 dinner (420 g bag)
      name: { en: 'Baked Salmon & Sweet Potato', uk: 'Запечений лосось із солодкою картоплею' },
      kcal: 1018,
      ingredients: [
        { name: { en: 'Salmon fillet', uk: 'Філе лосося'      }, amount: 300, unit: 'g',  category: 'fish'    },
        { name: { en: 'Sweet potato',  uk: 'Солодка картопля' }, amount: 280, unit: 'g',  category: 'produce' },
        { name: { en: 'Baby spinach',  uk: 'Шпинат'          }, amount: 150, unit: 'g',  category: 'produce' },
        { name: { en: 'Olive oil',     uk: 'Оливкова олія'   }, amount: 15,  unit: 'ml', category: 'pantry'  },
        { name: { en: 'Lemon',         uk: 'Лимон'           }, amount: 1,   unit: 'pc', category: 'produce' },
      ],
    },
  },

  // ── Day 1 · Tuesday W1 ────────────────────────────────────────────────
  {
    dayName:   { en: 'Tuesday',  uk: 'Вівторок' },
    shortName: { en: 'Tue',      uk: 'Вт'       },
    week: 1,
    breakfast: {
      // Greek yogurt → shared with Fri W1 breakfast (500 g tub)
      // Mixed berries → shared with Thu + Fri W1 breakfasts (500 g frozen bag)
      // Granola → shared with Fri W1 breakfast
      name: { en: 'Greek Yogurt Parfait & Toast', uk: 'Парфе з грецьким йогуртом та тости' },
      kcal: 857,
      ingredients: [
        { name: { en: 'Greek yogurt',      uk: 'Грецький йогурт'     }, amount: 320, unit: 'g', category: 'dairy-eggs' },
        { name: { en: 'Granola',           uk: 'Гранола'             }, amount: 80,  unit: 'g', category: 'grains'     },
        { name: { en: 'Mixed berries',     uk: 'Мікс ягід'           }, amount: 160, unit: 'g', category: 'produce'    },
        { name: { en: 'Whole grain bread', uk: 'Цільнозерновий хліб' }, amount: 80,  unit: 'g', category: 'grains'     },
        { name: { en: 'Honey',             uk: 'Мед'                 }, amount: 12,  unit: 'g', category: 'pantry'     },
      ],
    },
    lunch: {
      // Ground beef → shared Tue dinner + Sat W1 lunch (560 g total incl. batch below)
      // Baby spinach 2nd use (Mon dinner + Tue lunch + Fri dinner)
      name: { en: 'Ground Beef Noodle Bowl', uk: 'Боул із яловичим фаршем та локшиною' },
      kcal: 1245,
      ingredients: [
        { name: { en: 'Ground beef',  uk: 'Яловичий фарш'     }, amount: 200, unit: 'g',  category: 'meat'    },
        { name: { en: 'Egg noodles',  uk: 'Яєчна локшина'     }, amount: 150, unit: 'g',  category: 'grains'  },
        { name: { en: 'Baby spinach', uk: 'Шпинат'            }, amount: 120, unit: 'g',  category: 'produce' },
        { name: { en: 'Bell peppers', uk: 'Болгарський перець' }, amount: 120, unit: 'g',  category: 'produce' },
        { name: { en: 'Sesame oil',   uk: 'Кунжутна олія'     }, amount: 15,  unit: 'ml', category: 'pantry'  },
        { name: { en: 'Soy sauce',    uk: 'Соєвий соус'       }, amount: 25,  unit: 'ml', category: 'pantry'  },
      ],
    },
    dinner: {
      // ★ BATCH COOK (servings:2) — save half for Wed W1 lunch
      // Parmesan → shared Fri W1 lunch + Sat W1 dinner + Sun W1 dinner (110 g wedge)
      name: { en: 'Pasta Bolognese', uk: 'Паста болоньєзе' },
      kcal: 1150,
      servings: 2,
      note: { en: 'Large batch — save half for Wed lunch', uk: 'Велика порція — збережіть половину на обід у середу' },
      ingredients: [
        { name: { en: 'Ground beef',     uk: 'Яловичий фарш'       }, amount: 320, unit: 'g',  category: 'meat'      },
        { name: { en: 'Penne pasta',     uk: 'Паста пенне'         }, amount: 280, unit: 'g',  category: 'grains'    },
        { name: { en: 'Canned tomatoes', uk: 'Консервовані томати' }, amount: 320, unit: 'g',  category: 'pantry'    },
        { name: { en: 'Parmesan',        uk: 'Пармезан'            }, amount: 50,  unit: 'g',  category: 'dairy-eggs'},
        { name: { en: 'Olive oil',       uk: 'Оливкова олія'       }, amount: 16,  unit: 'ml', category: 'pantry'    },
        { name: { en: 'Onion',           uk: 'Цибуля'              }, amount: 120, unit: 'g',  category: 'produce'   },
        { name: { en: 'Garlic',          uk: 'Часник'              }, amount: 16,  unit: 'g',  category: 'produce'   },
      ],
    },
  },

  // ── Day 2 · Wednesday W1 ──────────────────────────────────────────────
  {
    dayName:   { en: 'Wednesday', uk: 'Середа' },
    shortName: { en: 'Wed',       uk: 'Ср'     },
    week: 1,
    breakfast: {
      // Avocado → shared with Thu W1 lunch (2 avocados)
      // Cherry tomatoes → shared Wed + Fri W1 lunch + Sat W1 ×2 (520 g punnet)
      name: { en: 'Scrambled Eggs & Avocado Toast', uk: 'Яєчня-бовтанка з тостами та авокадо' },
      kcal: 856,
      ingredients: [
        { name: { en: 'Eggs',              uk: 'Яйця'                 }, amount: 4,   unit: 'pc', category: 'dairy-eggs' },
        { name: { en: 'Whole grain bread', uk: 'Цільнозерновий хліб'  }, amount: 100, unit: 'g',  category: 'grains'     },
        { name: { en: 'Avocado',           uk: 'Авокадо'              }, amount: 150, unit: 'g',  category: 'produce'    },
        { name: { en: 'Butter',            uk: 'Вершкове масло'       }, amount: 10,  unit: 'g',  category: 'dairy-eggs' },
        { name: { en: 'Cherry tomatoes',   uk: 'Черрі томати'         }, amount: 80,  unit: 'g',  category: 'produce'    },
      ],
    },
    lunch: {
      // ★ LEFTOVER from Tue W1 dinner — no shopping needed
      name: { en: 'Leftover Pasta Bolognese', uk: 'Паста болоньєзе (залишки)' },
      kcal: 1150,
      isLeftover: true,
      ingredients: [],
    },
    dinner: {
      // Potatoes → shared Fri W1 dinner + Sun W1 lunch
      // Mushrooms → shared Sat W1 breakfast + Sun W1 dinner
      name: { en: 'Pork Tenderloin & Roasted Veg', uk: 'Свиняча вирізка з запеченими овочами' },
      kcal: 1029,
      ingredients: [
        { name: { en: 'Pork tenderloin', uk: 'Свиняча вирізка'   }, amount: 300, unit: 'g',  category: 'meat'      },
        { name: { en: 'Potatoes',        uk: 'Картопля'          }, amount: 320, unit: 'g',  category: 'produce'   },
        { name: { en: 'Green beans',     uk: 'Стручкова квасоля' }, amount: 160, unit: 'g',  category: 'produce'   },
        { name: { en: 'Mushrooms',       uk: 'Гриби'             }, amount: 120, unit: 'g',  category: 'produce'   },
        { name: { en: 'Olive oil',       uk: 'Оливкова олія'     }, amount: 20,  unit: 'ml', category: 'pantry'    },
        { name: { en: 'Butter',          uk: 'Вершкове масло'    }, amount: 15,  unit: 'g',  category: 'dairy-eggs'},
        { name: { en: 'Garlic',          uk: 'Часник'            }, amount: 8,   unit: 'g',  category: 'produce'   },
      ],
    },
  },

  // ── Day 3 · Thursday W1 ───────────────────────────────────────────────
  {
    dayName:   { en: 'Thursday', uk: 'Четвер' },
    shortName: { en: 'Thu',      uk: 'Чт'     },
    week: 1,
    breakfast: {
      // Mixed berries 2nd use. Maple syrup → shared Sun W1 breakfast
      name: { en: 'Pancakes with Berries', uk: 'Млинці з ягодами' },
      kcal: 902,
      ingredients: [
        { name: { en: 'All-purpose flour', uk: 'Борошно'          }, amount: 120, unit: 'g',  category: 'grains'     },
        { name: { en: 'Eggs',              uk: 'Яйця'             }, amount: 2,   unit: 'pc', category: 'dairy-eggs' },
        { name: { en: 'Whole milk',        uk: 'Молоко'           }, amount: 160, unit: 'ml', category: 'dairy-eggs' },
        { name: { en: 'Butter',            uk: 'Вершкове масло'   }, amount: 15,  unit: 'g',  category: 'dairy-eggs' },
        { name: { en: 'Mixed berries',     uk: 'Мікс ягід'        }, amount: 160, unit: 'g',  category: 'produce'    },
        { name: { en: 'Maple syrup',       uk: 'Кленовий сироп'   }, amount: 25,  unit: 'ml', category: 'pantry'     },
      ],
    },
    lunch: {
      // Canned tuna → shared Fri W1 lunch (2 cans). Broccoli 2nd use (Mon+Thu)
      // Avocado 2nd use (Wed breakfast + Thu lunch). Sesame oil shared Tue W1 lunch
      name: { en: 'Tuna Rice Bowl', uk: 'Боул із тунцем та рисом' },
      kcal: 1231,
      ingredients: [
        { name: { en: 'Canned tuna', uk: 'Консервований тунець' }, amount: 200, unit: 'g',  category: 'fish'    },
        { name: { en: 'White rice',  uk: 'Білий рис'            }, amount: 200, unit: 'g',  category: 'grains'  },
        { name: { en: 'Avocado',     uk: 'Авокадо'              }, amount: 120, unit: 'g',  category: 'produce' },
        { name: { en: 'Broccoli',    uk: 'Броколі'              }, amount: 80,  unit: 'g',  category: 'produce' },
        { name: { en: 'Cucumber',    uk: 'Огірок'               }, amount: 100, unit: 'g',  category: 'produce' },
        { name: { en: 'Soy sauce',   uk: 'Соєвий соус'         }, amount: 15,  unit: 'ml', category: 'pantry'  },
        { name: { en: 'Sesame oil',  uk: 'Кунжутна олія'       }, amount: 10,  unit: 'ml', category: 'pantry'  },
      ],
    },
    dinner: {
      // Chicken thighs → shared Sun W1 lunch (buy 640 g)
      // Bell peppers shared Tue W1 lunch + Thu dinner
      name: { en: 'Chicken Curry & Rice', uk: 'Курячий карі з рисом' },
      kcal: 1097,
      ingredients: [
        { name: { en: 'Chicken thighs', uk: 'Курячі стегна'      }, amount: 240, unit: 'g',  category: 'meat'    },
        { name: { en: 'White rice',     uk: 'Білий рис'          }, amount: 120, unit: 'g',  category: 'grains'  },
        { name: { en: 'Coconut milk',   uk: 'Кокосове молоко'    }, amount: 80,  unit: 'ml', category: 'pantry'  },
        { name: { en: 'Bell peppers',   uk: 'Болгарський перець' }, amount: 120, unit: 'g',  category: 'produce' },
        { name: { en: 'Onion',          uk: 'Цибуля'             }, amount: 80,  unit: 'g',  category: 'produce' },
        { name: { en: 'Curry paste',    uk: 'Паста карі'         }, amount: 20,  unit: 'g',  category: 'pantry'  },
        { name: { en: 'Garlic',         uk: 'Часник'             }, amount: 8,   unit: 'g',  category: 'produce' },
      ],
    },
  },

  // ── Day 4 · Friday W1 — FISH ONLY, NO MEAT ───────────────────────────
  {
    dayName:   { en: 'Friday',  uk: 'П\'ятниця' },
    shortName: { en: 'Fri',     uk: 'Пт'        },
    week: 1,
    breakfast: {
      // Mixed berries 3rd use. Greek yogurt 2nd use. Granola 2nd use. Banana 2nd use.
      name: { en: 'Smoothie Bowl & Toast', uk: 'Боул-смузі та тости' },
      kcal: 941,
      ingredients: [
        { name: { en: 'Banana',           uk: 'Банан'               }, amount: 160, unit: 'g', category: 'produce'    },
        { name: { en: 'Mixed berries',    uk: 'Мікс ягід'           }, amount: 160, unit: 'g', category: 'produce'    },
        { name: { en: 'Greek yogurt',     uk: 'Грецький йогурт'     }, amount: 160, unit: 'g', category: 'dairy-eggs' },
        { name: { en: 'Granola',          uk: 'Гранола'             }, amount: 64,  unit: 'g', category: 'grains'     },
        { name: { en: 'Whole grain bread',uk: 'Цільнозерновий хліб' }, amount: 80,  unit: 'g', category: 'grains'     },
        { name: { en: 'Peanut butter',    uk: 'Арахісове масло'     }, amount: 24,  unit: 'g', category: 'pantry'     },
      ],
    },
    lunch: {
      // Canned tuna 2nd use. Cherry tomatoes 2nd use. Parmesan 2nd use.
      name: { en: 'Tuna Pasta Salad', uk: 'Паста-салат із тунцем' },
      kcal: 1245,
      ingredients: [
        { name: { en: 'Canned tuna',       uk: 'Консервований тунець' }, amount: 200, unit: 'g',  category: 'fish'      },
        { name: { en: 'Penne pasta',       uk: 'Паста пенне'         }, amount: 200, unit: 'g',  category: 'grains'    },
        { name: { en: 'Cherry tomatoes',   uk: 'Черрі томати'        }, amount: 160, unit: 'g',  category: 'produce'   },
        { name: { en: 'Cucumber',          uk: 'Огірок'              }, amount: 100, unit: 'g',  category: 'produce'   },
        { name: { en: 'Mixed salad greens',uk: 'Мікс салатів'        }, amount: 80,  unit: 'g',  category: 'produce'   },
        { name: { en: 'Olive oil',         uk: 'Оливкова олія'       }, amount: 20,  unit: 'ml', category: 'pantry'    },
        { name: { en: 'Garlic',            uk: 'Часник'              }, amount: 8,   unit: 'g',  category: 'produce'   },
        { name: { en: 'Parmesan',          uk: 'Пармезан'            }, amount: 20,  unit: 'g',  category: 'dairy-eggs'},
      ],
    },
    dinner: {
      // Salmon 2nd use. Potatoes 2nd use. Baby spinach 3rd use. Lemon 2nd use.
      // Fresh parsley → shared Sat W1 dinner (buy 1 small bunch)
      name: { en: 'Baked Salmon & Roasted Potatoes', uk: 'Запечений лосось із картоплею' },
      kcal: 1052,
      ingredients: [
        { name: { en: 'Salmon fillet', uk: 'Філе лосося'     }, amount: 300, unit: 'g',  category: 'fish'    },
        { name: { en: 'Potatoes',      uk: 'Картопля'        }, amount: 300, unit: 'g',  category: 'produce' },
        { name: { en: 'Baby spinach',  uk: 'Шпинат'         }, amount: 150, unit: 'g',  category: 'produce' },
        { name: { en: 'Olive oil',     uk: 'Оливкова олія'  }, amount: 20,  unit: 'ml', category: 'pantry'  },
        { name: { en: 'Lemon',         uk: 'Лимон'          }, amount: 1,   unit: 'pc', category: 'produce' },
        { name: { en: 'Fresh parsley', uk: 'Свіжа петрушка' }, amount: 16,  unit: 'g',  category: 'produce' },
      ],
    },
  },

  // ── Day 5 · Saturday W1 ───────────────────────────────────────────────
  {
    dayName:   { en: 'Saturday', uk: 'Субота' },
    shortName: { en: 'Sat',      uk: 'Сб'     },
    week: 1,
    breakfast: {
      // Cherry tomatoes 3rd use. Mushrooms 2nd use.
      name: { en: 'Full English Breakfast', uk: 'Повний сніданок' },
      kcal: 958,
      ingredients: [
        { name: { en: 'Eggs',              uk: 'Яйця'                 }, amount: 3,   unit: 'pc', category: 'dairy-eggs' },
        { name: { en: 'Bacon',             uk: 'Бекон'                }, amount: 80,  unit: 'g',  category: 'meat'       },
        { name: { en: 'Whole grain bread', uk: 'Цільнозерновий хліб'  }, amount: 80,  unit: 'g',  category: 'grains'     },
        { name: { en: 'Cherry tomatoes',   uk: 'Черрі томати'         }, amount: 120, unit: 'g',  category: 'produce'    },
        { name: { en: 'Mushrooms',         uk: 'Гриби'                }, amount: 120, unit: 'g',  category: 'produce'    },
        { name: { en: 'Butter',            uk: 'Вершкове масло'       }, amount: 12,  unit: 'g',  category: 'dairy-eggs' },
      ],
    },
    lunch: {
      // Ground beef 3rd use. Tortilla → shared Wed W1 lunch was removed; now unique here.
      name: { en: 'Beef Tacos', uk: 'Тако з яловичиною' },
      kcal: 1160,
      ingredients: [
        { name: { en: 'Ground beef',   uk: 'Яловичий фарш'  }, amount: 200, unit: 'g', category: 'meat'      },
        { name: { en: 'Tortilla wraps',uk: 'Тортилья'        }, amount: 96,  unit: 'g', category: 'grains'    },
        { name: { en: 'Cheddar cheese',uk: 'Сир чеддер'     }, amount: 48,  unit: 'g', category: 'dairy-eggs'},
        { name: { en: 'Sour cream',    uk: 'Сметана'         }, amount: 64,  unit: 'g', category: 'dairy-eggs'},
        { name: { en: 'Lettuce',       uk: 'Салат айсберг'  }, amount: 80,  unit: 'g', category: 'produce'   },
        { name: { en: 'Tomato',        uk: 'Томат'           }, amount: 120, unit: 'g', category: 'produce'   },
        { name: { en: 'Lime',          uk: 'Лайм'            }, amount: 1,   unit: 'pc',category: 'produce'   },
      ],
    },
    dinner: {
      // Fresh parsley 2nd use. Parmesan 3rd use.
      name: { en: 'Shrimp Linguine', uk: 'Лінгвіні з креветками' },
      kcal: 1128,
      ingredients: [
        { name: { en: 'Shrimp',          uk: 'Креветки'       }, amount: 320, unit: 'g',  category: 'fish'      },
        { name: { en: 'Linguine pasta',  uk: 'Лінгвіні'       }, amount: 140, unit: 'g',  category: 'grains'    },
        { name: { en: 'Cherry tomatoes', uk: 'Черрі томати'   }, amount: 160, unit: 'g',  category: 'produce'   },
        { name: { en: 'Garlic',          uk: 'Часник'         }, amount: 12,  unit: 'g',  category: 'produce'   },
        { name: { en: 'Olive oil',       uk: 'Оливкова олія'  }, amount: 16,  unit: 'ml', category: 'pantry'    },
        { name: { en: 'Parmesan',        uk: 'Пармезан'       }, amount: 24,  unit: 'g',  category: 'dairy-eggs'},
        { name: { en: 'Fresh parsley',   uk: 'Свіжа петрушка' }, amount: 16,  unit: 'g',  category: 'produce'   },
      ],
    },
  },

  // ── Day 6 · Sunday W1 ─────────────────────────────────────────────────
  {
    dayName:   { en: 'Sunday',  uk: 'Неділя' },
    shortName: { en: 'Sun',     uk: 'Нд'     },
    week: 1,
    breakfast: {
      // Maple syrup 2nd use.
      name: { en: 'French Toast with Fruits', uk: 'Французькі тости з фруктами' },
      kcal: 850,
      ingredients: [
        { name: { en: 'White bread',  uk: 'Білий хліб'      }, amount: 140, unit: 'g',  category: 'grains'     },
        { name: { en: 'Eggs',         uk: 'Яйця'            }, amount: 2,   unit: 'pc', category: 'dairy-eggs' },
        { name: { en: 'Whole milk',   uk: 'Молоко'          }, amount: 100, unit: 'ml', category: 'dairy-eggs' },
        { name: { en: 'Butter',       uk: 'Вершкове масло'  }, amount: 15,  unit: 'g',  category: 'dairy-eggs' },
        { name: { en: 'Mixed fruits', uk: 'Мікс фруктів'    }, amount: 200, unit: 'g',  category: 'produce'    },
        { name: { en: 'Maple syrup',  uk: 'Кленовий сироп'  }, amount: 20,  unit: 'ml', category: 'pantry'     },
      ],
    },
    lunch: {
      // ★ BATCH COOK (servings:2) — save half for Mon W2 dinner
      // Chicken thighs 2nd use. Potatoes 3rd use. Carrot 2nd use.
      name: { en: 'Roast Chicken Thighs & Vegetables', uk: 'Запечені курячі стегна з овочами' },
      kcal: 1183,
      servings: 2,
      note: { en: 'Large batch — save half for Mon Week 2 dinner', uk: 'Велика порція — збережіть половину на вечерю в понеділок (2-й тиждень)' },
      ingredients: [
        { name: { en: 'Chicken thighs', uk: 'Курячі стегна'  }, amount: 800, unit: 'g',  category: 'meat'    },
        { name: { en: 'Potatoes',       uk: 'Картопля'        }, amount: 560, unit: 'g',  category: 'produce' },
        { name: { en: 'Carrot',         uk: 'Морква'          }, amount: 320, unit: 'g',  category: 'produce' },
        { name: { en: 'Onion',          uk: 'Цибуля'          }, amount: 240, unit: 'g',  category: 'produce' },
        { name: { en: 'Olive oil',      uk: 'Оливкова олія'  }, amount: 40,  unit: 'ml', category: 'pantry'  },
        { name: { en: 'Garlic',         uk: 'Часник'          }, amount: 24,  unit: 'g',  category: 'produce' },
        { name: { en: 'Fresh rosemary', uk: 'Свіжий розмарин' }, amount: 16,  unit: 'g',  category: 'produce' },
      ],
    },
    dinner: {
      // Mushrooms 3rd use. Parmesan 4th use.
      name: { en: 'Mushroom Risotto', uk: 'Грибний різотто' },
      kcal: 1058,
      ingredients: [
        { name: { en: 'Arborio rice',    uk: 'Рис арборіо'    }, amount: 160, unit: 'g',  category: 'grains'    },
        { name: { en: 'Mushrooms',       uk: 'Гриби'          }, amount: 240, unit: 'g',  category: 'produce'   },
        { name: { en: 'Parmesan',        uk: 'Пармезан'       }, amount: 40,  unit: 'g',  category: 'dairy-eggs'},
        { name: { en: 'Butter',          uk: 'Вершкове масло' }, amount: 16,  unit: 'g',  category: 'dairy-eggs'},
        { name: { en: 'Onion',           uk: 'Цибуля'         }, amount: 80,  unit: 'g',  category: 'produce'   },
        { name: { en: 'Olive oil',       uk: 'Оливкова олія'  }, amount: 12,  unit: 'ml', category: 'pantry'    },
        { name: { en: 'Vegetable broth', uk: 'Овочевий бульйон'},amount: 400, unit: 'ml', category: 'pantry'    },
      ],
    },
  },

  // ════════════════════════════════════════════════════════════════════════
  //  WEEK 2  (Days 7–13)  — different meals, same calorie targets
  //  Key protein clusters:
  //    Salmon       → Mon W2 lunch + Fri W2 dinner  (600 g)
  //    Canned tuna  → Thu W2 lunch + Fri W2 lunch   (2 cans)
  //    Chicken breast→ Tue W2 lunch + Sun W2 dinner (560 g)
  //    Beef chuck   → Tue W2 dinner batch + Wed W2 leftover
  //    Turkey mince → Thu W2 dinner
  //    Ground beef  → Sat W2 lunch
  //    Shrimp       → Sat W2 dinner
  //    Eggs across multiple mornings
  // ════════════════════════════════════════════════════════════════════════

  // ── Day 7 · Monday W2 ─────────────────────────────────────────────────
  {
    dayName:   { en: 'Monday',  uk: 'Понеділок' },
    shortName: { en: 'Mon',     uk: 'Пн'        },
    week: 2,
    breakfast: {
      // Cottage cheese + berries: light, no-cook
      // Mixed berries → shared Thu W2 + Fri W2 breakfasts (500 g bag)
      name: { en: 'Cottage Cheese Bowl & PB Toast', uk: 'Боул із сиром та тости з арахісовим маслом' },
      kcal: 894,
      ingredients: [
        { name: { en: 'Cottage cheese',   uk: 'Кисломолочний сир'   }, amount: 250, unit: 'g', category: 'dairy-eggs' },
        { name: { en: 'Mixed berries',    uk: 'Мікс ягід'           }, amount: 150, unit: 'g', category: 'produce'    },
        { name: { en: 'Honey',            uk: 'Мед'                 }, amount: 20,  unit: 'g', category: 'pantry'     },
        { name: { en: 'Whole grain bread',uk: 'Цільнозерновий хліб' }, amount: 150, unit: 'g', category: 'grains'     },
        { name: { en: 'Peanut butter',    uk: 'Арахісове масло'     }, amount: 24,  unit: 'g', category: 'pantry'     },
      ],
    },
    lunch: {
      // Salmon → shared Fri W2 dinner (600 g total)
      // Baby spinach → shared Wed W2 breakfast + Fri W2 dinner
      name: { en: 'Salmon & Spinach Quinoa Salad', uk: 'Лосось з кіноа та шпинатом' },
      kcal: 1292,
      ingredients: [
        { name: { en: 'Salmon fillet', uk: 'Філе лосося'   }, amount: 280, unit: 'g',  category: 'fish'    },
        { name: { en: 'Quinoa',        uk: 'Кіноа'         }, amount: 150, unit: 'g',  category: 'grains'  },
        { name: { en: 'Baby spinach',  uk: 'Шпинат'        }, amount: 150, unit: 'g',  category: 'produce' },
        { name: { en: 'Cucumber',      uk: 'Огірок'        }, amount: 100, unit: 'g',  category: 'produce' },
        { name: { en: 'Lemon',         uk: 'Лимон'         }, amount: 1,   unit: 'pc', category: 'produce' },
        { name: { en: 'Olive oil',     uk: 'Оливкова олія' }, amount: 15,  unit: 'ml', category: 'pantry'  },
      ],
    },
    dinner: {
      // ★ LEFTOVER from Sun W1 lunch — no shopping needed
      name: { en: 'Leftover Roast Chicken & Veg', uk: 'Запечена курка з овочами (залишки)' },
      kcal: 1183,
      isLeftover: true,
      ingredients: [],
    },
  },

  // ── Day 8 · Tuesday W2 ────────────────────────────────────────────────
  {
    dayName:   { en: 'Tuesday',  uk: 'Вівторок' },
    shortName: { en: 'Tue',      uk: 'Вт'       },
    week: 2,
    breakfast: {
      // Apple — unique to W2 for variety
      name: { en: 'Apple Cinnamon Oatmeal', uk: 'Вівсянка з яблуком та корицею' },
      kcal: 868,
      ingredients: [
        { name: { en: 'Rolled oats', uk: 'Вівсяні пластівці' }, amount: 180, unit: 'g',  category: 'grains'     },
        { name: { en: 'Apple',       uk: 'Яблуко'            }, amount: 200, unit: 'g',  category: 'produce'    },
        { name: { en: 'Whole milk',  uk: 'Молоко'            }, amount: 80,  unit: 'ml', category: 'dairy-eggs' },
        { name: { en: 'Honey',       uk: 'Мед'               }, amount: 15,  unit: 'g',  category: 'pantry'     },
        { name: { en: 'Cinnamon',    uk: 'Кориця'            }, amount: 3,   unit: 'g',  category: 'pantry'     },
      ],
    },
    lunch: {
      // Chicken breast → shared Sun W2 dinner (560 g total)
      // Parmesan → shared Thu W2 dinner + Sat W2 dinner + Sun W2 dinner
      name: { en: 'Chicken Caesar Salad', uk: 'Салат Цезар з куркою' },
      kcal: 1200,
      ingredients: [
        { name: { en: 'Chicken breast',    uk: 'Куряче філе'         }, amount: 320, unit: 'g',  category: 'meat'      },
        { name: { en: 'Romaine lettuce',   uk: 'Листя романо'        }, amount: 200, unit: 'g',  category: 'produce'   },
        { name: { en: 'Parmesan',          uk: 'Пармезан'            }, amount: 30,  unit: 'g',  category: 'dairy-eggs'},
        { name: { en: 'Whole grain bread', uk: 'Цільнозерновий хліб' }, amount: 150, unit: 'g',  category: 'grains'    },
        { name: { en: 'Greek yogurt',      uk: 'Грецький йогурт'     }, amount: 80,  unit: 'g',  category: 'dairy-eggs'},
        { name: { en: 'Olive oil',         uk: 'Оливкова олія'       }, amount: 30,  unit: 'ml', category: 'pantry'    },
        { name: { en: 'Garlic',            uk: 'Часник'              }, amount: 5,   unit: 'g',  category: 'produce'   },
      ],
    },
    dinner: {
      // ★ BATCH COOK (servings:2) — save half for Wed W2 lunch
      // Mushrooms → shared Sun W2 dinner
      name: { en: 'Beef & Root Vegetable Stew', uk: 'Яловичий рагу з коренеплодами' },
      kcal: 961,
      servings: 2,
      note: { en: 'Large batch — save half for Wed lunch', uk: 'Велика порція — збережіть половину на обід у середу' },
      ingredients: [
        { name: { en: 'Beef chuck',      uk: 'Яловичина для рагу'  }, amount: 600, unit: 'g',  category: 'meat'    },
        { name: { en: 'Potatoes',        uk: 'Картопля'            }, amount: 500, unit: 'g',  category: 'produce' },
        { name: { en: 'Carrot',          uk: 'Морква'              }, amount: 200, unit: 'g',  category: 'produce' },
        { name: { en: 'Onion',           uk: 'Цибуля'              }, amount: 150, unit: 'g',  category: 'produce' },
        { name: { en: 'Mushrooms',       uk: 'Гриби'               }, amount: 200, unit: 'g',  category: 'produce' },
        { name: { en: 'Beef stock',      uk: 'Яловичий бульйон'   }, amount: 500, unit: 'ml', category: 'pantry'  },
        { name: { en: 'Olive oil',       uk: 'Оливкова олія'       }, amount: 20,  unit: 'ml', category: 'pantry'  },
        { name: { en: 'Garlic',          uk: 'Часник'              }, amount: 10,  unit: 'g',  category: 'produce' },
      ],
    },
  },

  // ── Day 9 · Wednesday W2 ──────────────────────────────────────────────
  {
    dayName:   { en: 'Wednesday', uk: 'Середа' },
    shortName: { en: 'Wed',       uk: 'Ср'     },
    week: 2,
    breakfast: {
      // Baby spinach 2nd use (Mon W2 lunch + Wed W2 breakfast)
      // Cherry tomatoes → shared Thu W2 lunch + Sat W2 lunch + Sat W2 dinner
      name: { en: 'Feta & Spinach Omelette', uk: 'Омлет із фетою та шпинатом' },
      kcal: 839,
      ingredients: [
        { name: { en: 'Eggs',              uk: 'Яйця'                 }, amount: 3,   unit: 'pc', category: 'dairy-eggs' },
        { name: { en: 'Feta cheese',       uk: 'Сир фета'             }, amount: 60,  unit: 'g',  category: 'dairy-eggs' },
        { name: { en: 'Baby spinach',      uk: 'Шпинат'               }, amount: 100, unit: 'g',  category: 'produce'    },
        { name: { en: 'Whole grain bread', uk: 'Цільнозерновий хліб'  }, amount: 120, unit: 'g',  category: 'grains'     },
        { name: { en: 'Butter',            uk: 'Вершкове масло'       }, amount: 10,  unit: 'g',  category: 'dairy-eggs' },
        { name: { en: 'Cherry tomatoes',   uk: 'Черрі томати'         }, amount: 100, unit: 'g',  category: 'produce'    },
      ],
    },
    lunch: {
      // ★ LEFTOVER from Tue W2 dinner — no shopping needed
      name: { en: 'Leftover Beef Stew', uk: 'Яловичий рагу (залишки)' },
      kcal: 961,
      isLeftover: true,
      ingredients: [],
    },
    dinner: {
      // Mackerel: oily fish, healthy, different from salmon
      // Sweet potato → shared Sat W2 lunch
      name: { en: 'Baked Mackerel & Sweet Potato', uk: 'Запечена скумбрія із солодкою картоплею' },
      kcal: 1025,
      ingredients: [
        { name: { en: 'Mackerel fillet', uk: 'Філе скумбрії'        }, amount: 280, unit: 'g',  category: 'fish'    },
        { name: { en: 'Sweet potato',   uk: 'Солодка картопля'      }, amount: 280, unit: 'g',  category: 'produce' },
        { name: { en: 'Green beans',    uk: 'Стручкова квасоля'     }, amount: 160, unit: 'g',  category: 'produce' },
        { name: { en: 'Olive oil',      uk: 'Оливкова олія'         }, amount: 12,  unit: 'ml', category: 'pantry'  },
        { name: { en: 'Garlic',         uk: 'Часник'                }, amount: 8,   unit: 'g',  category: 'produce' },
        { name: { en: 'Lemon',          uk: 'Лимон'                 }, amount: 1,   unit: 'pc', category: 'produce' },
      ],
    },
  },

  // ── Day 10 · Thursday W2 ──────────────────────────────────────────────
  {
    dayName:   { en: 'Thursday', uk: 'Четвер' },
    shortName: { en: 'Thu',      uk: 'Чт'     },
    week: 2,
    breakfast: {
      // Banana → shared Sat W2 breakfast
      name: { en: 'Banana Overnight Oats', uk: 'Вівсяна каша з бананом' },
      kcal: 952,
      ingredients: [
        { name: { en: 'Rolled oats',  uk: 'Вівсяні пластівці' }, amount: 160, unit: 'g',  category: 'grains'     },
        { name: { en: 'Whole milk',   uk: 'Молоко'            }, amount: 100, unit: 'ml', category: 'dairy-eggs' },
        { name: { en: 'Banana',       uk: 'Банан'             }, amount: 150, unit: 'g',  category: 'produce'    },
        { name: { en: 'Honey',        uk: 'Мед'               }, amount: 15,  unit: 'g',  category: 'pantry'     },
        { name: { en: 'Peanut butter',uk: 'Арахісове масло'   }, amount: 20,  unit: 'g',  category: 'pantry'     },
      ],
    },
    lunch: {
      // Canned tuna → shared Fri W2 lunch (2 cans)
      // Cherry tomatoes 2nd use. White beans unique but canned = pantry
      name: { en: 'Tuna & White Bean Salad', uk: 'Салат із тунцем та білою квасолею' },
      kcal: 1236,
      ingredients: [
        { name: { en: 'Canned tuna',       uk: 'Консервований тунець'   }, amount: 200, unit: 'g',  category: 'fish'      },
        { name: { en: 'Canned white beans',uk: 'Консервована біла квасоля'},amount:300, unit: 'g',  category: 'pantry'    },
        { name: { en: 'Cherry tomatoes',   uk: 'Черрі томати'           }, amount: 150, unit: 'g',  category: 'produce'   },
        { name: { en: 'Mixed salad greens',uk: 'Мікс салатів'           }, amount: 150, unit: 'g',  category: 'produce'   },
        { name: { en: 'Whole grain bread', uk: 'Цільнозерновий хліб'    }, amount: 120, unit: 'g',  category: 'grains'    },
        { name: { en: 'Olive oil',         uk: 'Оливкова олія'          }, amount: 30,  unit: 'ml', category: 'pantry'    },
        { name: { en: 'Lemon',             uk: 'Лимон'                  }, amount: 1,   unit: 'pc', category: 'produce'   },
        { name: { en: 'Parmesan',          uk: 'Пармезан'               }, amount: 25,  unit: 'g',  category: 'dairy-eggs'},
      ],
    },
    dinner: {
      // Turkey mince: different protein from ground beef (Week 1)
      // Spaghetti: different pasta shape from penne/linguine
      name: { en: 'Turkey Mince Bolognese', uk: 'Болоньєзе з фаршем індички' },
      kcal: 1084,
      ingredients: [
        { name: { en: 'Turkey mince',    uk: 'Фарш із індички'    }, amount: 300, unit: 'g',  category: 'meat'      },
        { name: { en: 'Spaghetti',       uk: 'Спагеті'            }, amount: 120, unit: 'g',  category: 'grains'    },
        { name: { en: 'Canned tomatoes', uk: 'Консервовані томати' }, amount: 200, unit: 'g',  category: 'pantry'    },
        { name: { en: 'Onion',           uk: 'Цибуля'             }, amount: 80,  unit: 'g',  category: 'produce'   },
        { name: { en: 'Garlic',          uk: 'Часник'             }, amount: 8,   unit: 'g',  category: 'produce'   },
        { name: { en: 'Olive oil',       uk: 'Оливкова олія'      }, amount: 10,  unit: 'ml', category: 'pantry'    },
        { name: { en: 'Parmesan',        uk: 'Пармезан'           }, amount: 25,  unit: 'g',  category: 'dairy-eggs'},
      ],
    },
  },

  // ── Day 11 · Friday W2 — FISH ONLY, NO MEAT ──────────────────────────
  {
    dayName:   { en: 'Friday',  uk: 'П\'ятниця' },
    shortName: { en: 'Fri',     uk: 'Пт'        },
    week: 2,
    breakfast: {
      // Mixed berries 3rd use (Mon + Thu + Fri W2). Greek yogurt → shared across week.
      name: { en: 'Berry Yogurt Parfait', uk: 'Парфе з ягодами та йогуртом' },
      kcal: 911,
      ingredients: [
        { name: { en: 'Greek yogurt',      uk: 'Грецький йогурт'     }, amount: 300, unit: 'g', category: 'dairy-eggs' },
        { name: { en: 'Granola',           uk: 'Гранола'             }, amount: 100, unit: 'g', category: 'grains'     },
        { name: { en: 'Mixed berries',     uk: 'Мікс ягід'           }, amount: 200, unit: 'g', category: 'produce'    },
        { name: { en: 'Honey',             uk: 'Мед'                 }, amount: 15,  unit: 'g', category: 'pantry'     },
        { name: { en: 'Whole grain bread', uk: 'Цільнозерновий хліб' }, amount: 60,  unit: 'g', category: 'grains'     },
      ],
    },
    lunch: {
      // Canned tuna 2nd use. Eggs in nicoise. Classic dish.
      name: { en: 'Tuna Niçoise Salad', uk: 'Салат Нісуаз із тунцем' },
      kcal: 1207,
      ingredients: [
        { name: { en: 'Canned tuna',       uk: 'Консервований тунець' }, amount: 200, unit: 'g',  category: 'fish'      },
        { name: { en: 'Eggs',              uk: 'Яйця'                 }, amount: 2,   unit: 'pc', category: 'dairy-eggs'},
        { name: { en: 'Cherry tomatoes',   uk: 'Черрі томати'         }, amount: 150, unit: 'g',  category: 'produce'   },
        { name: { en: 'Green beans',       uk: 'Стручкова квасоля'   }, amount: 150, unit: 'g',  category: 'produce'   },
        { name: { en: 'Olives',            uk: 'Маслини'              }, amount: 80,  unit: 'g',  category: 'pantry'    },
        { name: { en: 'Mixed salad greens',uk: 'Мікс салатів'        }, amount: 150, unit: 'g',  category: 'produce'   },
        { name: { en: 'Potatoes',          uk: 'Картопля'             }, amount: 120, unit: 'g',  category: 'produce'   },
        { name: { en: 'Olive oil',         uk: 'Оливкова олія'        }, amount: 30,  unit: 'ml', category: 'pantry'    },
        { name: { en: 'Whole grain bread', uk: 'Цільнозерновий хліб'  }, amount: 120, unit: 'g',  category: 'grains'    },
      ],
    },
    dinner: {
      // Salmon 2nd use (Mon W2 lunch + Fri W2 dinner). Asparagus: unique, pairs perfectly.
      // Baby spinach 3rd use (Mon lunch + Wed breakfast + Fri dinner).
      name: { en: 'Baked Salmon with Asparagus', uk: 'Запечений лосось зі спаржею' },
      kcal: 991,
      ingredients: [
        { name: { en: 'Salmon fillet', uk: 'Філе лосося'    }, amount: 300, unit: 'g',  category: 'fish'    },
        { name: { en: 'Asparagus',     uk: 'Спаржа'         }, amount: 250, unit: 'g',  category: 'produce' },
        { name: { en: 'Baby spinach',  uk: 'Шпинат'         }, amount: 100, unit: 'g',  category: 'produce' },
        { name: { en: 'Potatoes',      uk: 'Картопля'       }, amount: 180, unit: 'g',  category: 'produce' },
        { name: { en: 'Olive oil',     uk: 'Оливкова олія'  }, amount: 20,  unit: 'ml', category: 'pantry'  },
        { name: { en: 'Lemon',         uk: 'Лимон'          }, amount: 1,   unit: 'pc', category: 'produce' },
        { name: { en: 'Garlic',        uk: 'Часник'         }, amount: 10,  unit: 'g',  category: 'produce' },
      ],
    },
  },

  // ── Day 12 · Saturday W2 ──────────────────────────────────────────────
  {
    dayName:   { en: 'Saturday', uk: 'Субота' },
    shortName: { en: 'Sat',      uk: 'Сб'     },
    week: 2,
    breakfast: {
      // Banana 2nd use. Walnuts: healthy fat, different from W1 Sat.
      name: { en: 'Banana Walnut Pancakes', uk: 'Млинці з бананом та волоськими горіхами' },
      kcal: 964,
      ingredients: [
        { name: { en: 'All-purpose flour', uk: 'Борошно'           }, amount: 100, unit: 'g',  category: 'grains'     },
        { name: { en: 'Eggs',              uk: 'Яйця'              }, amount: 2,   unit: 'pc', category: 'dairy-eggs' },
        { name: { en: 'Whole milk',        uk: 'Молоко'            }, amount: 150, unit: 'ml', category: 'dairy-eggs' },
        { name: { en: 'Banana',            uk: 'Банан'             }, amount: 150, unit: 'g',  category: 'produce'    },
        { name: { en: 'Walnuts',           uk: 'Волоські горіхи'   }, amount: 24,  unit: 'g',  category: 'pantry'     },
        { name: { en: 'Maple syrup',       uk: 'Кленовий сироп'   }, amount: 20,  unit: 'ml', category: 'pantry'     },
      ],
    },
    lunch: {
      // Ground beef (single use in W2). Sweet potato 2nd use (Wed W2 dinner + Sat lunch).
      // Cherry tomatoes 4th use this week.
      name: { en: 'Ground Beef Bowl with Sweet Potato', uk: 'Боул із яловичим фаршем та солодкою картоплею' },
      kcal: 1182,
      ingredients: [
        { name: { en: 'Ground beef',      uk: 'Яловичий фарш'     }, amount: 250, unit: 'g',  category: 'meat'      },
        { name: { en: 'Sweet potato',     uk: 'Солодка картопля'  }, amount: 300, unit: 'g',  category: 'produce'   },
        { name: { en: 'Cherry tomatoes',  uk: 'Черрі томати'      }, amount: 120, unit: 'g',  category: 'produce'   },
        { name: { en: 'Mixed salad greens',uk:'Мікс салатів'      }, amount: 100, unit: 'g',  category: 'produce'   },
        { name: { en: 'Olive oil',        uk: 'Оливкова олія'     }, amount: 15,  unit: 'ml', category: 'pantry'    },
        { name: { en: 'Garlic',           uk: 'Часник'            }, amount: 8,   unit: 'g',  category: 'produce'   },
        { name: { en: 'Sour cream',       uk: 'Сметана'           }, amount: 60,  unit: 'g',  category: 'dairy-eggs'},
      ],
    },
    dinner: {
      // Shrimp: different dish from W1 Sat (linguine → fried rice)
      // Sesame + soy: shared with Thu lunch in W1; fine as pantry
      name: { en: 'Shrimp Fried Rice', uk: 'Смажений рис із креветками' },
      kcal: 1136,
      ingredients: [
        { name: { en: 'Shrimp',       uk: 'Креветки'      }, amount: 280, unit: 'g',  category: 'fish'      },
        { name: { en: 'White rice',   uk: 'Білий рис'     }, amount: 150, unit: 'g',  category: 'grains'    },
        { name: { en: 'Eggs',         uk: 'Яйця'          }, amount: 2,   unit: 'pc', category: 'dairy-eggs'},
        { name: { en: 'Spring onions',uk: 'Зелена цибуля' }, amount: 50,  unit: 'g',  category: 'produce'   },
        { name: { en: 'Soy sauce',    uk: 'Соєвий соус'   }, amount: 20,  unit: 'ml', category: 'pantry'    },
        { name: { en: 'Sesame oil',   uk: 'Кунжутна олія' }, amount: 15,  unit: 'ml', category: 'pantry'    },
      ],
    },
  },

  // ── Day 13 · Sunday W2 ────────────────────────────────────────────────
  {
    dayName:   { en: 'Sunday',  uk: 'Неділя' },
    shortName: { en: 'Sun',     uk: 'Нд'     },
    week: 2,
    breakfast: {
      // Shakshuka — eggs baked in spiced tomatoes, Middle Eastern-inspired
      name: { en: 'Shakshuka', uk: 'Шакшука' },
      kcal: 885,
      ingredients: [
        { name: { en: 'Eggs',              uk: 'Яйця'                 }, amount: 3,   unit: 'pc', category: 'dairy-eggs' },
        { name: { en: 'Canned tomatoes',   uk: 'Консервовані томати'  }, amount: 300, unit: 'g',  category: 'pantry'     },
        { name: { en: 'Bell peppers',      uk: 'Болгарський перець'   }, amount: 100, unit: 'g',  category: 'produce'    },
        { name: { en: 'Onion',             uk: 'Цибуля'               }, amount: 80,  unit: 'g',  category: 'produce'    },
        { name: { en: 'Garlic',            uk: 'Часник'               }, amount: 8,   unit: 'g',  category: 'produce'    },
        { name: { en: 'Olive oil',         uk: 'Оливкова олія'        }, amount: 15,  unit: 'ml', category: 'pantry'     },
        { name: { en: 'Whole grain bread', uk: 'Цільнозерновий хліб'  }, amount: 150, unit: 'g',  category: 'grains'     },
      ],
    },
    lunch: {
      // Pork chops: different cut from W1 pork tenderloin. Apple adds W2 variety.
      name: { en: 'Pork Chops with Apple & Roasted Veg', uk: 'Свинячі відбивні з яблуком та овочами' },
      kcal: 1105,
      ingredients: [
        { name: { en: 'Pork chops', uk: 'Свинячі відбивні'  }, amount: 350, unit: 'g',  category: 'meat'    },
        { name: { en: 'Apple',      uk: 'Яблуко'            }, amount: 200, unit: 'g',  category: 'produce' },
        { name: { en: 'Potatoes',   uk: 'Картопля'          }, amount: 280, unit: 'g',  category: 'produce' },
        { name: { en: 'Onion',      uk: 'Цибуля'            }, amount: 100, unit: 'g',  category: 'produce' },
        { name: { en: 'Garlic',     uk: 'Часник'            }, amount: 10,  unit: 'g',  category: 'produce' },
        { name: { en: 'Olive oil',  uk: 'Оливкова олія'     }, amount: 20,  unit: 'ml', category: 'pantry'  },
      ],
    },
    dinner: {
      // Chicken breast 2nd use (Tue lunch + Sun dinner). Mushrooms 2nd use (Tue dinner + Sun dinner).
      // Greek yogurt for sauce.
      name: { en: 'Chicken & Mushroom Sauce with Rice', uk: 'Куряче філе з грибним соусом та рисом' },
      kcal: 1020,
      ingredients: [
        { name: { en: 'Chicken breast', uk: 'Куряче філе'     }, amount: 280, unit: 'g',  category: 'meat'      },
        { name: { en: 'White rice',     uk: 'Білий рис'       }, amount: 120, unit: 'g',  category: 'grains'    },
        { name: { en: 'Mushrooms',      uk: 'Гриби'           }, amount: 200, unit: 'g',  category: 'produce'   },
        { name: { en: 'Onion',          uk: 'Цибуля'          }, amount: 80,  unit: 'g',  category: 'produce'   },
        { name: { en: 'Greek yogurt',   uk: 'Грецький йогурт' }, amount: 100, unit: 'g',  category: 'dairy-eggs'},
        { name: { en: 'Olive oil',      uk: 'Оливкова олія'  }, amount: 15,  unit: 'ml', category: 'pantry'    },
        { name: { en: 'Garlic',         uk: 'Часник'          }, amount: 8,   unit: 'g',  category: 'produce'   },
      ],
    },
  },
];
