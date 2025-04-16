$(document).ready(function() {
    // Theme Toggle
    $("#themeToggle").click(function() {
        $("body").toggleClass("dark-mode");
        if ($("body").hasClass("dark-mode")) {
            document.documentElement.setAttribute("data-theme", "dark");
        } else {
            document.documentElement.setAttribute("data-theme", "light");
        }
    });
    
    // Navigation Active State for links
    $(".nav-link").click(function() {
        $(".nav-link").removeClass("active");
        $(this).addClass("active");
    });
    
    // Hamburger Menu Toggle (for mobile) with keydown support
    $("#navToggle").on("click keydown", function(e) {
        if (e.type === "keydown" && !/(13|32)/.test(e.keyCode)) return; // respond to Enter (13) or Space (32)
        var navMenu = $("#mainNav .nav-menu");
        navMenu.toggleClass("active");
        const expanded = navMenu.hasClass("active");
        $(this).attr("aria-expanded", expanded);
        e.preventDefault();
    });
    
    // Dropdown Toggle for Mobile with keydown support
    $(".nav-item.dropdown > .nav-link").on("click keydown", function(e) {
        if (e.type === "keydown" && !/(13|32)/.test(e.keyCode)) return;
        e.preventDefault();
        const expanded = $(this).attr("aria-expanded") === "true";
        $(this).attr("aria-expanded", !expanded);
        $(this).next(".dropdown-menu").slideToggle();
    });
    
    // FAQ Toggle with ARIA enhancement
    $(".faq-question").on("click keydown", function(e) {
        if (e.type === "keydown" && !/(13|32)/.test(e.keyCode)) return;
        e.preventDefault();
        const isExpanded = $(this).attr("aria-expanded") === "true";
        $(this).attr("aria-expanded", !isExpanded);
        $(this).toggleClass("active");
        $(this).next(".faq-answer").toggleClass("show");
    }).attr("tabindex", "0").attr("role", "button").attr("aria-expanded", "false");
    
    // Jump to Top Button: add aria-label for accessibility
    $("#jumpToTop").attr("aria-label", "Scroll to Top");
    
    // Scroll to Top Button Behavior
    $(window).scroll(function() {
        if ($(this).scrollTop() > 300) {
            $("#jumpToTop").addClass("visible");
        } else {
            $("#jumpToTop").removeClass("visible");
        }
    });
    
    $("#jumpToTop").click(function() {
        $("html, body").animate({scrollTop: 0}, 500);
    });
    
    // Countdown Timer
    function updateCountdown() {
        const now = new Date();
        const seasonStart = new Date(2025, 5, 1); // May 1, 2025
        const diff = seasonStart - now;
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        
        $("#countdown").text(`${days}d ${hours}h ${minutes}m`);
        
        // Current day calculation
        const serverStart = new Date(2024, 12, 31); // April 14, 2025
        const daysSinceStart = Math.floor((now - serverStart) / (1000 * 60 * 60 * 24)) + 1;
        $("#dayCount").text(daysSinceStart);
        
        // Progress calculation
        const totalDays = Math.floor((seasonStart - serverStart) / (1000 * 60 * 60 * 24));
        const progress = (daysSinceStart / totalDays) * 100;
        $("#progressFill").css("width", progress + "%");
    }
    
    updateCountdown();
    setInterval(updateCountdown, 60000);
    
    // Resource Calculator
    $("#calculateBtn").click(function() {
        const currentLevel = parseInt($("#currentLevel").val());
        const targetLevel = parseInt($("#targetLevel").val());
        const currentResistance = parseInt($("#currentResistance").val());
        const targetResistance = parseInt($("#targetResistance").val());
        const proteinRate = parseInt($("#proteinRate").val());
        const crystalRate = parseInt($("#crystalRate").val());
        
        // Basic calculation logic
        const levelDiff = targetLevel - currentLevel;
        const resistanceDiff = targetResistance - currentResistance;
        
        let proteinRequired = levelDiff * 15000 + (resistanceDiff * 10000);
        let crystalRequired = levelDiff * 200 + (resistanceDiff * 150);
        let fragmentsRequired = levelDiff * 50 + (resistanceDiff * 75);
        
        // Apply diminishing returns for high resistance
        if (targetResistance > 65) {
            const extraResistance = targetResistance - 65;
            proteinRequired += extraResistance * 5000;
            crystalRequired += extraResistance * 100;
            fragmentsRequired += extraResistance * 50;
        }
        
        // Calculate time required
        const daysForProtein = Math.ceil(proteinRequired / (proteinRate * 24));
        const daysForCrystals = Math.ceil(crystalRequired / crystalRate);
        const timeRequired = Math.max(daysForProtein, daysForCrystals);
        
        // Display results
        $("#proteinRequired").text(proteinRequired.toLocaleString());
        $("#crystalRequired").text(crystalRequired.toLocaleString());
        $("#fragmentsRequired").text(fragmentsRequired.toLocaleString());
        $("#timeRequired").text(timeRequired + " days");
        
        // Generate recommendations
        let recommendations = "";
        if (daysForProtein > daysForCrystals) {
            recommendations = "Focus on improving Protein Farm production.";
        } else {
            recommendations = "Focus on increasing Mutant Crystal gathering efficiency.";
        }
        if (targetResistance > 75 && currentResistance < 60) {
            recommendations += " Consider a more gradual resistance upgrade path for better efficiency.";
        }
        $("#recommendations").text(recommendations);
    });
    
    // Building level selector
    $(".building-level").click(function() {
        $(this).parent().find(".building-level").removeClass("active");
        $(this).addClass("active");
    });
});